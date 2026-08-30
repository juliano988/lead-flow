export enum SourceValues {
  LandingPage = 'landing-page',
  GoogleAds = 'google-ads',
  Linkedin = 'linkedin',
  Instagram = 'instagram',
  FacebookAds = 'facebook-ads',
  CsvImport = 'csv-import',
  Api = 'api',
  Referral = 'referral',
  Webinar = 'webinar',
  Ebook = 'ebook',
}

export default class Source {
  private readonly _value: SourceValues;

  constructor(value: string) {
    const source = this.parseSource(value.trim());

    if (!source) {
      throw new Error('Origem inválida');
    }

    this._value = source;
  }

  get value(): SourceValues {
    return this._value;
  }

  private parseSource(value: string): SourceValues | undefined {
    const normalizedValue = value.trim();

    return Object.values(SourceValues).find(
      (sourceValue) => normalizedValue === sourceValue,
    );
  }

  equals(other: Source): boolean {
    return this._value === other._value;
  }
}
