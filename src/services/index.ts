import { UserService } from './userService';
import { QuestionService } from './questionService';
import { AnswerService } from './answerService';
import { TagService } from './tagService';
import { InteractionService } from './interactionService';
import { CommentService } from './commentService';

// 创建服务实例
export const userService = new UserService();
export const questionService = new QuestionService();
export const answerService = new AnswerService();
export const tagService = new TagService();
export const interactionService = new InteractionService();
export const commentService = new CommentService();

// 导出类型
export type {
  UserService,
  QuestionService,
  AnswerService,
  TagService,
  InteractionService,
  CommentService
};
