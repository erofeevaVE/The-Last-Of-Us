// search.js - работает на GitHub Pages как API
const searchData = {
  "items": [ /* ВАШ ПОЛНЫЙ JSON С 60+ ЗАПИСЯМИ */ ]
};

// Обработчик поиска
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  
  // Настраиваем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }
  
  if (!query.trim()) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Добавьте параметр ?q=запрос'
    }), { headers });
  }
  
  const lowerQuery = query.toLowerCase();
  
  // Ищем во всех полях
  const results = searchData.items.filter(item => {
    return item.name.toLowerCase().includes(lowerQuery) ||
           item.description.toLowerCase().includes(lowerQuery) ||
           item.category.toLowerCase().includes(lowerQuery) ||
           item.type.toLowerCase().includes(lowerQuery) ||
           (Array.isArray(item.game) ? 
              item.game.some(g => g.toLowerCase().includes(lowerQuery)) :
              item.game.toLowerCase().includes(lowerQuery));
  });
  
  const response = {
    success: true,
    query: query,
    count: results.length,
    results: results.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      type: item.type,
      game: item.game,
      description: item.description.substring(0, 150) + (item.description.length > 150 ? '...' : ''),
      url: item.url
    }))
  };
  
  return new Response(JSON.stringify(response), { headers });
}
