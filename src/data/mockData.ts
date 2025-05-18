// 模拟用户数据
export const users = [
  {
    id: 'meathill',
    name: 'Meathill',
    avatar: 'https://same-assets.com/avatar-1.png',
    reputation: 1524,
    bio: '全栈开发者，在Web开发、移动应用和服务器开发领域拥有超过10年的经验',
    tags: [
      { id: 'javascript', name: 'JavaScript' },
      { id: 'vue', name: 'Vue.js' },
      { id: 'nodejs', name: 'Node.js' }
    ],
    stats: {
      questions: 42,
      answers: 187,
      followers: 256
    },
    createdAt: '2015-04-12T18:30:00Z',
    activities: [
      { type: 'question', id: '1010000046550995', title: '数据库承高并发场景下该如何优化？', date: '2023-05-17T09:15:00Z' },
      { type: 'answer', id: '1020000046548691', questionId: '1010000046548690', questionTitle: '求解，一个字符串配置的问题，求解决！！！！？', date: '2023-05-16T14:22:00Z' }
    ]
  },
  {
    id: 'kuailedexiang',
    name: '快乐的翔',
    avatar: 'https://same-assets.com/avatar-2.png',
    reputation: 872,
    bio: '前端开发工程师，专注于Vue和React生态',
    tags: [
      { id: 'vue', name: 'Vue.js' },
      { id: 'elementui', name: 'Element UI' },
      { id: 'css', name: 'CSS' }
    ],
    stats: {
      questions: 28,
      answers: 64,
      followers: 102
    },
    createdAt: '2018-07-22T10:15:00Z',
    activities: [
      { type: 'question', id: '1010000046551058', title: 'Element UI中ElMessageBox弹窗的样式修改', date: '2023-05-17T08:45:00Z' }
    ]
  },
  {
    id: 'nemesiszh',
    name: 'nemesiszh',
    avatar: 'https://same-assets.com/avatar-3.png',
    reputation: 645,
    bio: 'Java后端开发者，Spring全家桶爱好者',
    tags: [
      { id: 'java', name: 'Java' },
      { id: 'spring', name: 'Spring' },
      { id: 'springboot', name: 'Spring Boot' }
    ],
    stats: {
      questions: 15,
      answers: 42,
      followers: 78
    },
    createdAt: '2019-03-05T14:22:00Z',
    activities: [
      { type: 'question', id: '1010000046550983', title: 'springboot2 AOP导致NoSuchMethodException是什么原因？', date: '2023-05-17T07:30:00Z' }
    ]
  },
  {
    id: 'sevencode',
    name: 'Seven',
    avatar: 'https://same-assets.com/avatar-4.png',
    reputation: 945,
    bio: '算法工程师，擅长解决复杂的算法问题',
    tags: [
      { id: 'algorithm', name: '算法' },
      { id: 'dynamic-programming', name: '动态规划' },
      { id: 'frontend', name: '前端' }
    ],
    stats: {
      questions: 32,
      answers: 127,
      followers: 198
    },
    createdAt: '2017-05-18T09:44:00Z',
    activities: [
      { type: 'question', id: '1010000046548690', title: '求解，一个字符串配置的问题，求解决！！！！？', date: '2023-05-16T11:05:00Z' }
    ]
  },
  {
    id: 'idiomeo',
    name: 'Idiomeo',
    avatar: 'https://same-assets.com/avatar-5.png',
    reputation: 1240,
    bio: 'AI和自然语言处理研究者，专注于NLP和机器学习领域',
    tags: [
      { id: 'nlp', name: '自然语言处理' },
      { id: 'machine-learning', name: '机器学习' },
      { id: 'python', name: 'Python' }
    ],
    stats: {
      questions: 18,
      answers: 94,
      followers: 276
    },
    createdAt: '2016-11-03T15:55:00Z',
    activities: [
      { type: 'question', id: '1010000046423063', title: '如何判断一段文本中的人名？', date: '2023-05-15T09:17:00Z' }
    ]
  }
];

// 模拟问题数据
export const questions = [
  {
    id: '1010000046550995',
    title: '数据库承高并发场景下该如何优化？',
    content: `我的系统需要支持高并发访问，但在压力测试中发现数据库成为了瓶颈。现有架构是采用MySQL主从复制，但仍然无法满足需求。请问有什么好的优化方案？

我考虑了以下几种方案：
1. 引入缓存层，比如Redis
2. 数据库分片
3. 读写分离进一步优化

但不确定哪种最适合我的场景，希望能得到一些实战经验。`,
    votes: 0,
    answers: 1,
    views: 146,
    tags: ['数据库性能优化', 'mysql', 'redis', '高并发'],
    author: {
      id: 'meathill',
      name: 'Meathill',
      avatar: 'https://same-assets.com/avatar-1.png',
    },
    createdAt: '2023-05-17T09:15:00Z',
    status: 'answered',
    isSolved: false
  },
  {
    id: '1010000046551058',
    title: 'Element UI中ElMessageBox弹窗的样式修改',
    content: `我在使用Element UI的ElMessageBox组件时，想要修改其默认样式。具体来说，我想修改：

1. 弹窗的宽度
2. 标题的颜色和字体大小
3. 内容区域的内边距

我尝试过直接在样式中覆盖，但似乎不生效：

\`\`\`css
.el-message-box {
  width: 500px !important;
}
.el-message-box__title {
  color: #409eff;
  font-size: 20px;
}
\`\`\`

请问有什么正确的方法可以修改这些样式？`,
    votes: 0,
    answers: 0,
    views: 72,
    tags: ['vue.js', 'element-ui', 'css'],
    author: {
      id: 'kuailedexiang',
      name: '快乐的翔',
      avatar: 'https://same-assets.com/avatar-2.png',
    },
    createdAt: '2023-05-17T08:45:00Z',
    status: 'unanswered',
    isSolved: false
  },
  {
    id: '1010000046550983',
    title: 'springboot2 AOP导致NoSuchMethodException是什么原因？',
    content: `我在Spring Boot项目中使用AOP切面，但在运行时遇到了NoSuchMethodException异常。

我的配置如下：

\`\`\`java
@Aspect
@Component
public class LoggingAspect {

    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}

    @Around("serviceMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long end = System.currentTimeMillis();
        System.out.println("执行时间: " + (end - start) + "ms");
        return result;
    }
}
\`\`\`

错误堆栈如下：
\`\`\`
java.lang.NoSuchMethodException: com.example.service.UserServiceImpl.findById(java.lang.Long)
    at java.base/java.lang.Class.getMethod(Class.java:2108)
    at org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:344)
\`\`\`

UserService接口确实有findById方法，而且UserServiceImpl也正确实现了该方法。请问这个问题可能是什么原因造成的？`,
    votes: 0,
    answers: 0,
    views: 94,
    tags: ['springboot', 'aop', 'java'],
    author: {
      id: 'nemesiszh',
      name: 'nemesiszh',
      avatar: 'https://same-assets.com/avatar-3.png',
    },
    createdAt: '2023-05-17T07:30:00Z',
    status: 'unanswered',
    isSolved: false
  },
  {
    id: '1010000046548690',
    title: '求解，一个字符串配置的问题，求解决！！！！？',
    content: `我遇到了一个字符串配置的问题，需要从多个可能的配置方案中找出最优解。

问题描述：
给定一个字符串S和一个字符串数组wordDict，我需要判断S是否可以被拆分成wordDict中的一个或多个单词的组合，并找出所有可能的组合方式。

例如：
S = "catsanddog"
wordDict = ["cat", "cats", "and", "sand", "dog"]

可能的组合有：
"cats and dog"
"cat sand dog"

我尝试使用了回溯算法，但在处理较长的字符串时性能很差。有没有更高效的解决方案？`,
    votes: 0,
    answers: 2,
    views: 266,
    tags: ['算法', '动态规划', '前端', '贪婪'],
    author: {
      id: 'sevencode',
      name: 'Seven',
      avatar: 'https://same-assets.com/avatar-4.png',
    },
    createdAt: '2023-05-16T11:05:00Z',
    status: 'answered',
    isSolved: false
  },
  {
    id: '1010000046423063',
    title: '如何判断一段文本中的人名？',
    content: `我正在开发一个自然语言处理应用，需要从中文文本中提取人名。目前考虑了以下几种方法：

1. 使用预训练的命名实体识别(NER)模型
2. 基于规则和词典的方法
3. 自己训练一个识别模型

但我不确定哪种方法在准确性和性能上更优。

有没有人有相关经验，或者推荐一些开源工具？我希望能在准确率达到85%以上的同时，处理速度也能满足实时分析的需求。

另外，如果使用预训练模型，有没有针对中文人名特别优化过的模型推荐？`,
    votes: 0,
    answers: 2,
    views: 720,
    tags: ['自然语言处理', 'python', '机器学习'],
    author: {
      id: 'idiomeo',
      name: 'Idiomeo',
      avatar: 'https://same-assets.com/avatar-5.png',
    },
    createdAt: '2023-05-15T09:17:00Z',
    status: 'answered',
    isSolved: true
  }
];

// 模拟回答数据
export const answers = [
  {
    id: '1020000046550996',
    questionId: '1010000046550995',
    content: `在高并发场景下，数据库优化确实是一个关键点。根据我的经验，你可以考虑以下方案：

1. **缓存优化**：
   - 引入Redis缓存热点数据，特别是读多写少的数据
   - 使用本地缓存(如Caffeine)减轻数据库压力
   - 实现多级缓存策略

2. **数据库层面**：
   - 读写分离：使用ProxySQL或MyCat等中间件
   - 分库分表：水平或垂直拆分，推荐Sharding-JDBC
   - 优化SQL和索引：确保有合适的索引，避免全表扫描
   - 调整数据库参数：如innodb_buffer_pool_size, max_connections等

3. **架构调整**：
   - 考虑使用CQRS模式，分离读写操作
   - 引入消息队列，异步处理非实时任务
   - 对于特定场景，考虑使用NoSQL数据库

在实施前，我建议先做性能测试，找出真正的瓶颈点。有时问题可能是单一查询引起的，优化该查询可能比架构调整效果更明显。`,
    author: {
      id: 'tech_architect',
      name: 'TechArchitect',
      avatar: 'https://same-assets.com/avatar-6.png',
    },
    votes: 3,
    createdAt: '2023-05-17T10:45:00Z',
    isAccepted: false
  },
  {
    id: '1020000046548691',
    questionId: '1010000046548690',
    content: `这是一个典型的单词拆分问题，可以使用动态规划来解决，会比回溯算法高效很多。

以下是解决方案：

1. 首先使用动态规划判断字符串是否可拆分：

\`\`\`javascript
function wordBreak(s, wordDict) {
    const wordSet = new Set(wordDict);
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[s.length];
}
\`\`\`

2. 然后使用记忆化递归来找出所有可能的组合：

\`\`\`javascript
function wordBreakAll(s, wordDict) {
    const wordSet = new Set(wordDict);
    const memo = new Map();

    function backtrack(start) {
        if (memo.has(start)) {
            return memo.get(start);
        }

        const result = [];
        if (start === s.length) {
            result.push("");
            return result;
        }

        for (let end = start + 1; end <= s.length; end++) {
            const word = s.substring(start, end);
            if (wordSet.has(word)) {
                const subResults = backtrack(end);
                for (const subResult of subResults) {
                    result.push(word + (subResult ? " " + subResult : ""));
                }
            }
        }

        memo.set(start, result);
        return result;
    }

    return backtrack(0);
}
\`\`\`

这个解决方案结合了动态规划的效率和记忆化递归的全面性，可以有效处理较长的字符串。

对于你的例子：
\`\`\`
S = "catsanddog"
wordDict = ["cat", "cats", "and", "sand", "dog"]
\`\`\`

这个算法会返回 ["cats and dog", "cat sand dog"]，时间复杂度为O(n³)，其中n是字符串长度。`,
    author: {
      id: 'meathill',
      name: 'Meathill',
      avatar: 'https://same-assets.com/avatar-1.png',
    },
    votes: 5,
    createdAt: '2023-05-16T14:22:00Z',
    isAccepted: true
  },
  {
    id: '1020000046548692',
    questionId: '1010000046548690',
    content: `你遇到的是一个词语拆分问题，除了动态规划外，还可以考虑使用贪心算法来优化某些特定场景。

以下是一个基于贪心的解决方案，特别适用于词典较大且字符串较长的情况：

\`\`\`python
def word_break_greedy(s, word_dict):
    word_set = set(word_dict)
    word_list = sorted(word_dict, key=len, reverse=True)  # 按长度排序

    def dfs(start, path, result):
        if start == len(s):
            result.append(' '.join(path))
            return True

        # 优先尝试更长的词
        for word in word_list:
            if start + len(word) <= len(s) and s[start:start+len(word)] == word:
                path.append(word)
                dfs(start + len(word), path, result)
                path.pop()

    result = []
    dfs(0, [], result)
    return result
\`\`\`

这个解决方案的优势在于优先尝试更长的词，可以减少回溯次数。对于某些特定的输入，性能会比纯动态规划更好。

当然，最佳的解决方案是结合动态规划和贪心算法：
1. 先用动态规划判断是否有解
2. 如果有解，再用记忆化搜索找出所有组合

对于更复杂的输入，你还可以考虑使用Trie树来优化单词查找，进一步提升性能。`,
    author: {
      id: 'algorithm_expert',
      name: 'AlgorithmExpert',
      avatar: 'https://same-assets.com/avatar-7.png',
    },
    votes: 3,
    createdAt: '2023-05-16T17:15:00Z',
    isAccepted: false
  },
  {
    id: '1020000046423064',
    questionId: '1010000046423063',
    content: `对于中文人名识别，我有一些实际经验可以分享：

1. **预训练NER模型**:
   - HanLP提供了针对中文优化的NER模型，中文人名识别F1分数可达95%以上
   - BERT/RoBERTa等预训练模型加上中文NER任务微调，效果也很好

2. **开源工具推荐**:
   - HanLP: https://github.com/hankcs/HanLP
   - LTP (语言技术平台): https://github.com/HIT-SCIR/ltp
   - THULAC (清华大学自然语言处理与社会人文计算实验室): https://github.com/thunlp/THULAC

3. **人名识别的效果对比**:
   | 工具 | 准确率 | 召回率 | F1分数 | 处理速度 |
   |------|--------|--------|--------|----------|
   | HanLP | 94.2% | 92.8% | 93.5% | ~5000字/秒 |
   | LTP | 92.3% | 90.1% | 91.2% | ~3000字/秒 |
   | THULAC | 90.8% | 89.5% | 90.1% | ~4000字/秒 |

4. **实用建议**:
   - 对于通用领域，直接使用预训练模型就能达到不错的效果
   - 对于特定领域（如古文、医学文献），建议在领域数据上微调
   - 结合规则进行后处理可以进一步提高准确率，如职位+名字的模式

这是我在实际项目中使用HanLP的简单示例：

\`\`\`python
from pyhanlp import *

def extract_names(text):
    term_list = HanLP.segment(text)
    result = []
    for term in term_list:
        if term.nature == "nr":  # nr是人名标记
            result.append(term.word)
    return result

# 使用示例
text = "张三和李四是好朋友，他们经常和王五一起打篮球。"
names = extract_names(text)
print(names)  # 输出: ['张三', '李四', '王五']
\`\`\`

如果你的应用对实时性要求高，HanLP是个不错的选择；如果更注重准确率，可以考虑基于BERT的模型。`,
    author: {
      id: 'nlp_researcher',
      name: 'NLP研究者',
      avatar: 'https://same-assets.com/avatar-8.png',
    },
    votes: 8,
    createdAt: '2023-05-15T12:30:00Z',
    isAccepted: true
  },
  {
    id: '1020000046423065',
    questionId: '1010000046423063',
    content: `我想补充一点，对于中文人名识别，你还可以考虑以下方法：

1. **基于深度学习的方法**：
   - BiLSTM-CRF模型在中文NER任务上表现优异
   - 最新的BERT-BiLSTM-CRF结构可以达到96%以上的F1分数
   - 如果计算资源有限，可以考虑轻量级的ALBERT或TinyBERT模型

2. **自训练模型的数据准备**：
   - MSRA NER数据集包含大量标注好的中文人名
   - 人民日报NER语料也是很好的训练资源
   - 可以考虑使用数据增强技术，如同义词替换、上下文变换等

3. **实现示例（PyTorch + Transformers）**：

\`\`\`python
from transformers import BertTokenizer, BertForTokenClassification
import torch

# 加载预训练模型和分词器
tokenizer = BertTokenizer.from_pretrained('bert-base-chinese')
model = BertForTokenClassification.from_pretrained('bert-base-chinese', num_labels=9)  # 假设有9个NER标签

# 微调后使用模型
def extract_names(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    predictions = torch.argmax(outputs.logits, dim=2)

    # 处理预测结果，提取人名
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    labels = predictions[0].tolist()

    names = []
    current_name = ""
    for token, label in zip(tokens, labels):
        if label == 1:  # 假设1是B-PER（人名开始）
            if current_name:
                names.append(current_name)
            current_name = token.replace("##", "")
        elif label == 2:  # 假设2是I-PER（人名内部）
            current_name += token.replace("##", "")
        else:
            if current_name:
                names.append(current_name)
                current_name = ""

    if current_name:
        names.append(current_name)

    return names
\`\`\`

4. **性能优化建议**：
   - 使用量化技术减小模型体积，加快推理速度
   - 批处理输入可以提高吞吐量
   - 考虑使用ONNX或TensorRT进行模型部署

对于实时应用，你可以结合规则和轻量级模型，先用规则快速筛选可能的人名，再用模型进行精确识别，这样可以在保证准确率的同时提高处理速度。`,
    author: {
      id: 'ai_practitioner',
      name: 'AI实践者',
      avatar: 'https://same-assets.com/avatar-9.png',
    },
    votes: 5,
    createdAt: '2023-05-15T15:45:00Z',
    isAccepted: false
  }
];

// 标签数据
export const tags = [
  { id: 'javascript', name: 'JavaScript', count: 5428 },
  { id: 'python', name: 'Python', count: 4237 },
  { id: 'java', name: 'Java', count: 3982 },
  { id: 'mysql', name: 'MySQL', count: 2541 },
  { id: 'vue', name: 'Vue.js', count: 2145 },
  { id: 'react', name: 'React', count: 1987 },
  { id: 'nodejs', name: 'Node.js', count: 1876 },
  { id: 'algorithm', name: '算法', count: 1654 },
  { id: 'database', name: '数据库', count: 1543 },
  { id: 'springboot', name: 'Spring Boot', count: 1432 },
  { id: 'docker', name: 'Docker', count: 1321 },
  { id: 'linux', name: 'Linux', count: 1265 },
  { id: 'css', name: 'CSS', count: 1187 },
  { id: 'html', name: 'HTML', count: 1143 },
  { id: 'redis', name: 'Redis', count: 1098 },
  { id: 'elementui', name: 'Element UI', count: 987 },
  { id: 'spring', name: 'Spring', count: 965 },
  { id: 'git', name: 'Git', count: 897 },
  { id: 'frontend', name: '前端', count: 876 },
  { id: 'backend', name: '后端', count: 854 },
  { id: 'machine-learning', name: '机器学习', count: 832 },
  { id: 'nlp', name: '自然语言处理', count: 543 },
  { id: 'dynamic-programming', name: '动态规划', count: 432 },
  { id: 'database-optimization', name: '数据库性能优化', count: 321 },
  { id: 'aop', name: 'AOP', count: 287 }
];
