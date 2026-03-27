import { Injectable, signal } from '@angular/core';

interface TranslateResponse {
  translatedText: string;
}

interface TranslateErrorResponse {
  error: string;
}

export interface TranslateAllResult {
  descEn: string;
  descPt: string;
  nameEn: string;
  namePt: string;
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _isTranslating = signal(false);

  readonly isTranslating = this._isTranslating.asReadonly();

  private async _fetchTranslation(text: string, targetLang: 'EN' | 'PT'): Promise<string> {
    const response = await fetch('/api/translate', {
      body: JSON.stringify({ targetLang, text }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = (await response.json()) as TranslateErrorResponse;
      throw new Error(errorData.error ?? `Translation API error: ${response.status}`);
    }

    const data = (await response.json()) as TranslateResponse;
    return data.translatedText;
  }

  async translateAll(name: string, description: string): Promise<TranslateAllResult> {
    this._isTranslating.set(true);

    try {
      const [nameEn, namePt, descEn, descPt] = await Promise.all([
        this._fetchTranslation(name, 'EN'),
        this._fetchTranslation(name, 'PT'),
        this._fetchTranslation(description, 'EN'),
        this._fetchTranslation(description, 'PT'),
      ]);
      return { descEn, descPt, nameEn, namePt };
    } finally {
      this._isTranslating.set(false);
    }
  }
}
