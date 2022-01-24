type Polygon = {
  sides: number;
  name: string;
};

const SIDE_MAP: any = {
  0: 'not a polygon',
  3: 'triangle',
  4: 'square',
  5: 'not yet supported',
  6: 'not yet supported',
};

const createPolygon = (sides: number): any => {
  if (sides > 0 && sides < 5) {
    return { sides, name: SIDE_MAP[sides] };
  } else {
    throw new Error(SIDE_MAP[sides]);
  }
};

describe('createPolygon', () => {
  describe('successful', () => {
    it('returns a triangle for 3 sides', () => {
      const result = createPolygon(3);

      expect(result).toHaveProperty('name', 'triangle');
    });

    it('returns a square for 4 sides', () => {
      const result = createPolygon(4);

      expect(result).toHaveProperty('name', 'square');
    });
  });

  describe('failed', () => {
    it('throws not a polygon error for 0 side', () => {
      expect(() => createPolygon(0)).toThrow('not a polygon');
    });

    it('throws a not supported error for 6 sides', () => {
      expect(() => createPolygon(6)).toThrow('not yet supported');
    });
  });
});
