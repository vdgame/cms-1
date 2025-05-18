import type { APIRoute } from 'astro';
import { interactionService } from '../../../services';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, targetType, targetId, reason, description } = body;

    // 验证必填字段
    if (!userId || !targetType || !targetId || !reason) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证 targetType
    if (!['question', 'answer'].includes(targetType)) {
      return new Response(JSON.stringify({ error: 'Invalid target type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 执行举报
    const result = await interactionService.report(userId, targetType, targetId, reason, description);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing report:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
