import type { APIRoute } from 'astro';
import { answerService } from '../../../services';

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, authorId, content } = body;

    // 验证必填字段
    if (!id || !authorId || !content) {
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
      return new Response(JSON.stringify({ error: 'Unauthorized to edit this answer' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新回答
    const updatedAnswer = await answerService.updateAnswer(id, content);

    return new Response(JSON.stringify(updatedAnswer), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating answer:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
