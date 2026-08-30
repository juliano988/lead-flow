export enum ScoreClassification {
  Qualified = 'QUALIFIED',
  Nurture = 'NURTURE',
  Rejected = 'REJECTED',
}

export default class Score {
  private readonly _value: number;
  private readonly _classification: ScoreClassification;

  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Pontuação inválida');
    }

    this._value = value;
    this._classification = this.classify(this._value);
  }

  get value(): number {
    return this._value;
  }

  get classification(): ScoreClassification {
    return this._classification;
  }

  equals(other: Score): boolean {
    return this._value === other._value;
  }

  private classify(value: number): ScoreClassification {
    if (value < 40) {
      return ScoreClassification.Rejected;
    }

    if (value < 70) {
      return ScoreClassification.Nurture;
    }

    return ScoreClassification.Qualified;
  }
}
