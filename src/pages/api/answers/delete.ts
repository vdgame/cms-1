import type { APIRoute } from 'astro';
import { answerService } from '../../../services';

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, authorId } = body;

    // 验证必填字段
    if (!id || !authorId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取回答
    const answer = await answerService.getAnswerById(id);

    // 验证回答存在
    if (!answer) {
      return new Response(JSON.stringify({ error: 'Answer not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证作者权限
    if (answer.author.id !== authorId) {
      return new Response(JSON.stringify({ error: 'Unauthorized to delete this answer' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 删除回答
    const result = await answerService.deleteAnswer(id);

    // 如果删除失败
    if (!result) {
      return new Response(JSON.stringify({ error: 'Failed to delete answer' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Answer deleted successfully' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting answer:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
