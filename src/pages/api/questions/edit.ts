import type { APIRoute } from 'astro';
import { questionService } from '../../../services';

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, authorId, title, content, tags } = body;

    // 验证必填字段
    if (!id || !authorId || !title || !content) {
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
      return new Response(JSON.stringify({ error: 'Unauthorized to edit this question' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新问题
    const updatedQuestion = await questionService.updateQuestion(id, {
      title,
      content,
      tags: tags || question.tags
    });

    return new Response(JSON.stringify(updatedQuestion), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
