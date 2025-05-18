import type { APIRoute } from 'astro';
import { answerService, questionService } from '../../../services';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { answerId, questionId, userId } = body;

    // 验证必填字段
    if (!answerId || !questionId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取问题
    const question = await questionService.getQuestionById(questionId);

    // 验证问题存在
    if (!question) {
      return new Response(JSON.stringify({ error: 'Question not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证用户是问题的作者
    if (question.author.id !== userId) {
      return new Response(JSON.stringify({ error: 'Only the question author can mark the best answer' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取回答
    const answer = await answerService.getAnswerById(answerId);

    // 验证回答存在
    if (!answer) {
      return new Response(JSON.stringify({ error: 'Answer not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证回答属于这个问题
    if (answer.questionId !== questionId) {
      return new Response(JSON.stringify({ error: 'Answer does not belong to this question' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 标记为最佳回答
    await answerService.markAsAccepted(answerId, questionId);

    return new Response(JSON.stringify({ success: true, message: 'Answer marked as accepted' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error marking best answer:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
