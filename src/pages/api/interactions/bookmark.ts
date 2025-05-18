import type { APIRoute } from 'astro';
import { interactionService } from '../../../services';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, questionId } = body;

    // 验证必填字段
    if (!userId || !questionId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 执行收藏/取消收藏
    const result = await interactionService.bookmark(userId, questionId);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing bookmark:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
