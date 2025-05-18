import type { APIRoute } from 'astro';
import { questionService } from '../../services';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!query) {
      return new Response(JSON.stringify({ error: 'Search query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证搜索类型
    if (!['all', 'tag', 'content', 'author'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid search type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await questionService.searchQuestions(query, type as any, page, limit);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error searching questions:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
