import type { APIRoute } from 'astro';
import { interactionService } from '../../../services';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const targetType = url.searchParams.get('targetType');
    const targetId = url.searchParams.get('targetId');

    // 验证必填字段
    if (!userId || !targetType || !targetId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证 targetType
    if (!['question', 'answer', 'tag', 'user'].includes(targetType)) {
      return new Response(JSON.stringify({ error: 'Invalid target type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取用户互动状态
    const interactions = await interactionService.getUserInteractions(userId, targetType, targetId);

    return new Response(JSON.stringify(interactions), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching interaction status:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
