import type { APIRoute } from 'astro';
import { questionService } from '../../../services';

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

    // 获取问题
    const question = await questionService.getQuestionById(id);

    // 验证问题存在
    if (!question) {
      return new Response(JSON.stringify({ error: 'Question not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证作者权限
    if (question.author.id !== authorId) {
      return new Response(JSON.stringify({ error: 'Unauthorized to delete this question' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 删除问题
    const result = await questionService.deleteQuestion(id);

    // 如果删除失败
    if (!result) {
      return new Response(JSON.stringify({ error: 'Failed to delete question' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Question deleted successfully' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
