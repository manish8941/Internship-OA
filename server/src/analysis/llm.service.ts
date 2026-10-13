import dotenv from 'dotenv';
dotenv.config();

export interface LLMResponse {
  content: string;
  provider: 'OLLAMA_LOCAL_LLM' | 'DETERMINISTIC_OFFLINE_ENGINE';
  modelUsed: string;
}

export class LLMService {
  private useOllama: boolean;
  private ollamaUrl: string;
  private model: string;
  private isOllamaAvailable: boolean | null = null;

  constructor() {
    this.useOllama = process.env.USE_OLLAMA === 'true';
    this.ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3';
  }

  public async checkAvailability(): Promise<boolean> {
    if (!this.useOllama) {
      this.isOllamaAvailable = false;
      return false;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${this.ollamaUrl}/api/tags`, { signal: controller.signal });
      clearTimeout(timeout);
      this.isOllamaAvailable = res.ok;
      return res.ok;
    } catch {
      this.isOllamaAvailable = false;
      return false;
    }
  }

  public async generatePrompt(systemPrompt: string, userPrompt: string): Promise<LLMResponse> {
    const isAvailable = this.isOllamaAvailable ?? (await this.checkAvailability());

    if (isAvailable && this.useOllama) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(`${this.ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.model,
            system: systemPrompt,
            prompt: userPrompt,
            stream: false,
            options: {
              temperature: 0.7,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          const data: any = await response.json();
          return {
            content: data.response || '',
            provider: 'OLLAMA_LOCAL_LLM',
            modelUsed: this.model,
          };
        }
      } catch (e) {
        // Fall back gracefully to deterministic engine
      }
    }

    return {
      content: '',
      provider: 'DETERMINISTIC_OFFLINE_ENGINE',
      modelUsed: 'offline-rule-synthesis-engine-v1',
    };
  }
}

export const llmService = new LLMService();
