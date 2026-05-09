import os
import json
import httpx
import random
import asyncio
import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image, ImageDraw, ImageFont
from supabase import create_client, Client

app = FastAPI(title="课文漫游-Supabase云端版")

# ================= 1. 配置区 =================

# --- Supabase 配置 ---
SUPABASE_URL = "https://yvhjcqnsvrnjejwgdrlr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aGpjcW5zdnJuamVqd2dkcmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTQ4MjIsImV4cCI6MjA5MzU3MDgyMn0.7Fb_w64OvFjkhqGde8fPk_w2Qv446RBZXJCues0SdB4"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- DeepSeek 配置 ---
DEEPSEEK_API_KEY = "sk-c9ea6887cf524832bcd670fd82ed603e".strip()
DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"

# --- ComfyUI 配置 ---
COMFYUI_API_URL = "http://127.0.0.1:8000/prompt"
COMFYUI_OUTPUT_DIR = r"C:\Users\Administrator\Documents\ComfyUI\output" 
DESKTOP_PATH = os.path.join(os.path.expanduser("~"), "Desktop", "课文漫游产出")

if not os.path.exists(DESKTOP_PATH):
    os.makedirs(DESKTOP_PATH)

class LessonRequest(BaseModel):
    title: str
    content: str
    user_id: str = None

# ================= 2. 核心逻辑函数 =================

async def analyze_with_deepseek(task_id: int, title: str, content: str):
    """DeepSeek 编剧模式：生成提示词并更新数据库"""
    print(f"🎬 [Task {task_id}] DeepSeek 开始解析意境...")
    
    prompt = f"你是一个漫画导演。请将《{title}》的内容“{content}”转化成一段精简的英文AI绘画提示词。只要英文，风格包含: Manga style, sharp line art, cel-shaded, masterpiece. 不要返回中文。"
    
    # 构建请求头
    current_headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "stream": False
    }

    # 关键修复：强制 proxies=None 避开系统代理干扰
    async with httpx.AsyncClient() as client:
        try:
            # 关键修复：显式传递 headers=current_headers
            res = await client.post(
                DEEPSEEK_URL, 
                json=payload, 
                headers=current_headers, 
                timeout=30.0
            )
            
            if res.status_code != 200:
                print(f"❌ DS 验证失败响应: {res.text}")
                raise Exception(f"DS Error: {res.status_code}")
            
            ai_prompt = res.json()['choices'][0]['message']['content'].strip()
            
            # 更新 Supabase (确保表里有 ai_prompt 字段)
            supabase.table("lessons").update({"ai_prompt": ai_prompt}).eq("id", task_id).execute()
            print(f"✅ [Task {task_id}] 提示词已入库: {ai_prompt[:30]}...")
            return ai_prompt
            
        except Exception as e:
            print(f"❌ DS解析失败报告: {e}")
            # 兜底提示词，防止流程卡死
            return "Manga style, high quality, masterpiece, school scenery"

def process_subtitle(file_path, text):
    """本地压字幕逻辑"""
    try:
        time.sleep(2.0) # 稍微延长等待时间确保文件写入
        img = Image.open(file_path)
        width, height = img.size
        draw = ImageDraw.Draw(img, "RGBA")
        
        try:
            font = ImageFont.truetype("simhei.ttf", 40)
        except:
            font = ImageFont.load_default()

        rect_h = height // 7
        draw.rectangle([0, height - rect_h, width, height], fill=(0, 0, 0, 160))

        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        draw.text(((width - tw) // 2, height - (rect_h // 2) - (th // 2)), 
                  text, font=font, fill=(255, 255, 255))

        save_name = f"成品_{int(time.time())}.png"
        final_path = os.path.join(DESKTOP_PATH, save_name)
        img.save(final_path)
        return final_path
    except Exception as e:
        print(f"❌ 字幕合成失败: {e}")
        return file_path

async def monitor_comfy_and_update(task_id: int, original_text: str):
    """后台监视器：出图后更新 Supabase 最终状态"""
    print(f"👀 [Task {task_id}] 正在监视 ComfyUI 进度...")
    
    for _ in range(30): 
        await asyncio.sleep(5)
        if not os.path.exists(COMFYUI_OUTPUT_DIR): continue
        
        files = [f for f in os.listdir(COMFYUI_OUTPUT_DIR) if f.endswith(('.png', '.jpg'))]
        if not files: continue
        
        latest_file = max([os.path.join(COMFYUI_OUTPUT_DIR, f) for f in files], key=os.path.getctime)
        
        if time.time() - os.path.getctime(latest_file) < 15:
            final_local_path = process_subtitle(latest_file, original_text)
            
            supabase.table("lessons").update({
                "image_url": final_local_path,
                "status": "completed"
            }).eq("id", task_id).execute()
            
            print(f"🎉 [Task {task_id}] 全部完成！成品已保存。")
            return

    supabase.table("lessons").update({"status": "timeout"}).eq("id", task_id).execute()
    print(f"⏰ [Task {task_id}] 监视超时。")

# ================= 3. 接口区 =================

@app.post("/api/generate-lesson-images")
async def generate_lesson_images(request: LessonRequest):
    # STEP 1: 初始入库 (请确保表里有 status 字段，且 user_id 是 text 类型)
    try:
        db_res = supabase.table("lessons").insert({
            "title": request.title,
            "content": request.content,
            "user_id": str(request.user_id), 
            "status": "processing"
        }).execute()
        
        if not db_res.data:
            raise Exception("No data returned from Supabase")
        task_id = db_res.data[0]['id']
    except Exception as e:
        print(f"🔥 Supabase 插入报错: {e}")
        raise HTTPException(status_code=500, detail=f"数据库同步失败，请检查表字段: {e}")

    # STEP 2: 异步调用 DeepSeek
    ai_prompt = await analyze_with_deepseek(task_id, request.title, request.content)

    # STEP 3: 调用 ComfyUI
    try:
        with open("image_z_image_turbo.json", "r", encoding="utf-8") as f:
            workflow = json.load(f)
        
        # 根据实际 workflow 节点 ID 注入
        workflow["57:27"]["inputs"]["text"] = ai_prompt 
        workflow["57:3"]["inputs"]["seed"] = random.randint(1, 10**15)

        async with httpx.AsyncClient() as client:
            await client.post(COMFYUI_API_URL, json={"prompt": workflow}, timeout=10.0)
    except Exception as e:
        print(f"❌ ComfyUI 调用异常: {e}")
        # 这里不抛出异常，因为入库已经成功，可以手动补救
        supabase.table("lessons").update({"status": "comfy_error"}).eq("id", task_id).execute()

    # STEP 4: 启动后台监视任务
    asyncio.create_task(monitor_comfy_and_update(task_id, request.content))

    return {
        "status": "success",
        "task_id": task_id,
        "ai_prompt": ai_prompt,
        "message": "任务已启动，请查看本地桌面文件夹"
    }

if __name__ == "__main__":
    import uvicorn
    # 强制端口 8001 启动
    uvicorn.run(app, host="127.0.0.1", port=8001)