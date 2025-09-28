// xApiService.js - React frontend service calling local backend
const BACKEND_BASE_URL = 'http://localhost:4000';

class XApiService {
  constructor() {}

  /**
   * Post a job listing (via backend)
   * @param {Object} jobData - Job posting data
   * @returns {Promise<Object>} - API response
   */
  async postJobListing(jobData) {
    try {
      const tweetText = this.formatJobTweet(jobData);

      const response = await fetch(`${BACKEND_BASE_URL}/post-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tweetText })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Unknown error');

      return { success: true, data: result.data };
    } catch (error) {
      console.error('X API Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test connection via backend
   */
  async testConnection() {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/test-connection`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Connection failed');
      return { success: true, message: result.message || 'Connection successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Format job data into a tweet
   */
  formatJobTweet(jobData) {
    const { title, company, location, job_type, salary, description } = jobData;

    const hashtags = this.generateHashtags(jobData);
    const salaryText = salary ? `💰 ${salary}` : '';
    const maxDescriptionLength = 200;
    const truncatedDescription = description?.length > maxDescriptionLength
      ? description.substring(0, maxDescriptionLength) + '...'
      : description || '';

    let tweet = `🚀 New Job Opportunity!\n\n`;
    tweet += `📋 ${title}\n`;
    tweet += `🏢 ${company}\n`;
    tweet += `📍 ${location}\n`;
    tweet += `⏰ ${job_type || 'Full-time'}\n`;
    if (salaryText) tweet += `${salaryText}\n`;
    tweet += `\n${truncatedDescription}\n\n`;
    tweet += `Apply now on JobSathi! 🔗\n\n`;
    tweet += hashtags;

    if (tweet.length > 280) tweet = this.truncateTweet(tweet, jobData);
    return tweet;
  }

  /**
   * Generate hashtags
   */
  generateHashtags(jobData) {
    const baseHashtags = ['#JobSathi', '#Jobs', '#Hiring', '#Career'];

    const jobTypeHashtags = {
      'Frontend Developer': ['#Frontend', '#React', '#JavaScript', '#WebDev'],
      'Backend Developer': ['#Backend', '#NodeJS', '#Python', '#API'],
      'Data Scientist': ['#DataScience', '#MachineLearning', '#AI', '#Analytics'],
      'Product Manager': ['#ProductManagement', '#PM', '#Strategy', '#Leadership'],
      'Full-stack Developer': ['#FullStack', '#WebDev', '#JavaScript', '#React'],
      'DevOps Engineer': ['#DevOps', '#AWS', '#Docker', '#Kubernetes'],
      'UI/UX Designer': ['#UX', '#UI', '#Design', '#UserExperience']
    };

    const title = jobData.title?.toLowerCase() || '';
    const description = jobData.description?.toLowerCase() || '';

    let specificHashtags = [];
    for (const [jobType, hashtags] of Object.entries(jobTypeHashtags)) {
      if (title.includes(jobType.toLowerCase()) || description.includes(jobType.toLowerCase())) {
        specificHashtags = hashtags;
        break;
      }
    }

    const techHashtags = [];
    const techKeywords = {
      'react': '#React', 'vue': '#Vue', 'angular': '#Angular', 'node': '#NodeJS',
      'python': '#Python', 'java': '#Java', 'javascript': '#JavaScript', 'typescript': '#TypeScript',
      'aws': '#AWS', 'docker': '#Docker', 'kubernetes': '#Kubernetes',
      'machine learning': '#MachineLearning', 'ai': '#AI'
    };

    for (const [keyword, hashtag] of Object.entries(techKeywords)) {
      if (title.includes(keyword) || description.includes(keyword)) techHashtags.push(hashtag);
    }

    const allHashtags = [...baseHashtags, ...specificHashtags, ...techHashtags];
    return [...new Set(allHashtags)].slice(0, 10).join(' ');
  }

  /**
   * Truncate tweet to 280 chars
   */
  truncateTweet(tweet, jobData) {
    const maxLength = 280;
    const hashtags = this.generateHashtags(jobData);
    let shortTweet = `🚀 New Job: ${jobData.title} at ${jobData.company}\n`;
    shortTweet += `📍 ${jobData.location} | ${jobData.job_type || 'Full-time'}\n`;
    if (jobData.salary) shortTweet += `💰 ${jobData.salary}\n`;
    shortTweet += `\nApply on JobSathi! 🔗\n\n`;
    shortTweet += hashtags;
    return shortTweet.slice(0, maxLength);
  }
}

// Export singleton
const xApiService = new XApiService();
export default xApiService;
