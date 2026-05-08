<template>
  <div class="bg-gray-100 h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="bg-white border-b-4 border-black p-3 flex justify-between items-center z-10">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="bg-yellow-400 p-1 comic-border">
            <BookOpen class="w-5 h-5" />
          </div>
          <span class="text-xl font-bold tracking-tighter italic">课文漫游</span>
        </NuxtLink>
        <div class="h-6 w-px bg-gray-300 mx-2"></div>
        <h2 class="font-bold text-gray-600">正在编辑: 《背影》- 朱自清</h2>
      </div>
      <div class="flex items-center space-x-4">
        <button class="flex items-center space-x-1 font-bold px-3 py-1 hover:bg-gray-100 transition-colors">
          <Save class="w-4 h-4" />
          <span>保存草稿</span>
        </button>
        <button class="bg-black text-white px-6 py-1.5 comic-border font-bold hover:bg-yellow-400 hover:text-black transition-all flex items-center space-x-2">
          <Share2 class="w-4 h-4" />
          <span>发布作品</span>
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar - Text Selection -->
      <aside class="w-72 bg-white border-r-4 border-black flex flex-col">
        <div class="p-4 border-b-2 border-black">
          <div class="relative">
            <input type="text" placeholder="搜索课文..." class="w-full pl-10 pr-4 py-2 bg-gray-100 comic-border focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <Search class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          <div>
            <h3 class="font-black text-sm uppercase text-gray-400 mb-3">最近阅读</h3>
            <ul class="space-y-2">
              <li class="p-3 bg-yellow-100 comic-border cursor-pointer flex items-center space-x-3">
                <FileText class="w-4 h-4 text-yellow-600" />
                <span class="font-bold text-sm">背影</span>
              </li>
              <li class="p-3 hover:bg-gray-100 border-2 border-transparent cursor-pointer flex items-center space-x-3">
                <FileText class="w-4 h-4 text-gray-400" />
                <span class="font-bold text-sm text-gray-600">桃花源记</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-black text-sm uppercase text-gray-400 mb-3">推荐课文</h3>
            <ul class="space-y-2">
              <li v-for="book in ['三峡', '荷塘月色', '岳阳楼记']" :key="book" class="p-3 hover:bg-gray-100 border-2 border-transparent cursor-pointer flex items-center space-x-3">
                <Book class="w-4 h-4 text-gray-400" />
                <span class="font-bold text-sm text-gray-600">{{ book }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="p-4 bg-gray-50 border-t-4 border-black">
          <button class="w-full flex items-center justify-center space-x-2 p-3 bg-white comic-border font-bold hover:bg-blue-50">
            <PlusCircle class="w-5 h-5" />
            <span>上传自定义课文</span>
          </button>
        </div>
      </aside>

      <!-- Main Content - Editor Area -->
      <main class="flex-1 flex flex-col bg-yellow-50 overflow-hidden">
        <!-- Toolbar -->
        <div class="bg-white border-b-2 border-black p-2 flex space-x-2">
          <button v-for="(tool, i) in toolbar" :key="i" class="p-2 hover:bg-gray-100 rounded" :title="tool.title">
            <component :is="tool.icon" class="w-5 h-5" />
          </button>
          <div class="flex-1"></div>
          <div class="flex items-center space-x-2 px-4">
            <span class="text-sm font-bold text-gray-500">缩放:</span>
            <select class="text-sm border-2 border-black px-1 font-bold">
              <option>100%</option>
              <option>75%</option>
              <option>50%</option>
            </select>
          </div>
        </div>

        <!-- Workspace -->
        <div class="flex-1 flex overflow-hidden p-6 gap-6">
          <!-- Text Editor Side -->
          <div class="w-1/3 flex flex-col space-y-4">
            <div class="bg-white comic-border flex-1 flex flex-col overflow-hidden">
              <div class="p-3 bg-black text-white font-bold flex justify-between items-center">
                <span>课文内容</span>
                <Type class="w-4 h-4" />
              </div>
              <div id="text-editor" class="flex-1 p-6 overflow-y-auto custom-scrollbar leading-relaxed text-lg outline-none" contenteditable="true">
                <p class="mb-4">我与父亲不相见已二年以上了，我最不能忘记的是他的背影。</p>
                <p class="mb-4">那年冬天，祖母死了，父亲的差使也交卸了，正是祸不单行的日子。我从北京到徐州，打算跟着父亲奔丧回家。到徐州见着父亲，看见满院狼藉的东西，又想起祖母，不禁簌簌地流下眼泪。父亲说：“事已如此，不必难过，好在天无绝人之路！”</p>
                <p class="mb-4 bg-yellow-200 p-2 border-l-4 border-yellow-500">到南京时，有朋友约去游逛，勾留了一日；第二日上午便须渡江到浦口，下午上车北去。父亲因为事忙，本已说定不送我，叫旅馆里一个熟识的茶房陪我同去。他再三嘱嘱咐茶房，甚是仔细。但他终于不放心，怕茶房不妥帖；颇踌躇了一会。</p>
                <p class="mb-4">其实我那年已二十岁，北京已来往过两三次，是没有什么要紧的了。他踌躇了一会，终于决定还是自己送我去。我再三劝他不必去；他只说：“不要紧，他们去不好！”</p>
              </div>
            </div>
          </div>

          <!-- Comic Preview Side -->
          <div class="flex-1 flex flex-col space-y-4">
            <div class="bg-white comic-border-lg flex-1 overflow-y-auto custom-scrollbar p-8">
              <div class="max-w-3xl mx-auto space-y-12">
                <!-- Comic Panel 1 -->
                <div class="relative group">
                  <div class="comic-border-lg overflow-hidden bg-gray-50">
                    <img src="https://images.unsplash.com/photo-1590402444527-46af49f9674a?auto=format&fit=crop&q=80&w=800" alt="Scene 1" class="w-full h-64 object-cover grayscale">
                    <div class="absolute top-4 left-4 bg-white border-2 border-black p-2 max-w-xs font-bold shadow-md">
                      "我与父亲不相见已二年以上了..."
                    </div>
                    <div class="absolute bottom-4 right-4 bg-yellow-300 border-2 border-black px-4 py-2 font-black italic shadow-lg">
                      序幕
                    </div>
                  </div>
                  <div class="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="bg-white p-2 comic-border hover:bg-yellow-400"><Edit class="w-4 h-4" /></button>
                    <button class="bg-white p-2 comic-border hover:bg-red-400"><Trash2 class="w-4 h-4" /></button>
                  </div>
                </div>

                <!-- Comic Panel 2 -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="comic-border-lg overflow-hidden bg-gray-50 h-64 relative">
                    <img src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400" alt="Scene 2" class="w-full h-full object-cover sepia">
                    <div class="absolute bottom-4 left-4 bg-white border-2 border-black p-2 font-bold text-sm">
                      徐州奔丧，满院狼藉
                    </div>
                  </div>
                  <div class="comic-border-lg overflow-hidden bg-gray-50 h-64 relative">
                    <img src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400" alt="Scene 3" class="w-full h-full object-cover">
                    <div class="absolute top-4 right-4 bg-white border-2 border-black p-2 rounded-full font-bold">
                      "不必难过..."
                    </div>
                  </div>
                </div>

                <!-- Comic Panel 3 (Highlighted) -->
                <div class="relative group">
                  <div class="comic-border-lg overflow-hidden bg-yellow-100 p-2 ring-4 ring-yellow-400">
                    <div class="h-80 bg-white border-2 border-black relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800" alt="Scene 4" class="w-full h-full object-cover opacity-80">
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="bg-white/90 p-6 comic-border max-w-md text-center">
                          <Sparkles class="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                          <p class="font-black text-xl">父亲踌躇了一会，终于决定还是自己送我去。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="absolute -left-4 -top-4 bg-red-500 text-white px-3 py-1 font-bold comic-border -rotate-6">
                    当前选中分镜
                  </div>
                </div>
              </div>
            </div>

            <!-- AI Suggestions -->
            <div class="bg-blue-600 comic-border p-4 text-white">
              <div class="flex items-center space-x-2 mb-2">
                <BrainCircuit class="w-5 h-5" />
                <span class="font-bold">AI 创意助手提示:</span>
              </div>
              <p class="text-sm opacity-90">检测到这段文字描写了父亲内心的矛盾（踌躇），建议在漫画分镜中使用“特写镜头”表现父亲的面部表情，或使用“对比色调”来强化离别的情感氛围。</p>
              <div class="mt-3 flex space-x-2">
                <button class="text-xs bg-white text-blue-600 px-3 py-1 font-bold rounded hover:bg-yellow-400 hover:text-black transition-colors">采用建议</button>
                <button class="text-xs border border-white/50 px-3 py-1 font-bold rounded hover:bg-white/10">换一个</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { 
  BookOpen, Save, Share2, Search, FileText, Book, 
  PlusCircle, Wand2, LayoutGrid, UserSquare2, Type, 
  Edit, Trash2, Sparkles, BrainCircuit 
} from 'lucide-vue-next'

const toolbar = [
  { icon: Wand2, title: 'AI 分析' },
  { icon: LayoutGrid, title: '提取分镜' },
  { icon: UserSquare2, title: '角色设定' }
]
</script>
