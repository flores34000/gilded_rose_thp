var { Shop, Item } = require('../src/gilded_rose.js').default;
describe("GildedRose shop manager", function () {
  var listItems;

  beforeEach(function () {
    listItems = [];
  });


  it("Baisser de 1 la qualité et sellIn d'item normaux", function () {
    listItems.push(new Item("+5 Dexterity Vest", 10, 20));
    listItems.push(new Item("Mana Cake", 3, 6));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: 2, quality: 5 }
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Augmenter la qualité de 1 pour Aged Brie et Backstage passes", function () {
    listItems.push(new Item("Aged Brie", 20, 30));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 20, 30));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 31 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });
  
  // ajout de la regle "qualité augmente par 2 quand il reste 10 jours ou moins"

  it("qualité augmente par 2 quand il reste 10 jours ou moins", function () {
    listItems.push(new Item("Aged Brie", 10, 20));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 9, 8));
    
    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();
    
    var expected = [
      { sellIn: 9, quality: 22 },
      { sellIn: 8, quality: 10 }
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

// ajout de la regle "qualité augmente par 3 quand il reste 5 jours ou moins"

it("qualité augmente par 2 quand il reste 10 jours ou moins", function () {
  listItems.push(new Item("Aged Brie", 5, 20));
  listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 4, 8));
  
  const gildedRose = new Shop(listItems);
  const items = gildedRose.updateQuality();
  
  var expected = [
    { sellIn: 4, quality: 23 },
    { sellIn: 3, quality: 11 }
  ];
  expected.forEach(function (testCase, idx) {
    expect(items[idx].quality).toBe(testCase.quality);
    expect(items[idx].sellIn).toBe(testCase.sellIn);
  });
});

  // regle si la qualité est  plus de 50
  it("qualité n'est pas plus grande de 50", function () {
    listItems.push(new Item("Aged Brie", 10, 50));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 9, 50));
    // listItems.push(new Item("test", 9, 50));
    
    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();
    
    var expected = [
      { sellIn: 9, quality: 50},
      { sellIn: 8, quality: 50 },
      // { sellIn: 8, quality: 50}
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  // ajout de la regle pour tester sulfura  (pas de date de peremption, pas de perte de qualiteé)
  it("sulfura pas de perenption et pas de perte de qualitée", function () {
    listItems.push(new Item("Sulfuras, Hand of Ragnaros", 10, 80));
    listItems.push(new Item("Sulfuras, Hand of Ragnaros", 20, 80));
    
    
    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();
    
    var expected = [
      { sellIn: 10, quality: 80},
      { sellIn: 20, quality: 80},
      
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  // Une fois que la date de péremption est passée, la qualité se dégrade deux fois plus rapidement.
  it("perenption passée qualité se degrade 2 fois plus vite", function () {
    listItems.push(new Item("test date depassée 1", 0, 40));
    listItems.push(new Item("test date depassée 2", 0, 10));
    listItems.push(new Item("test date depassée 3", -1, 20));
    
    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();
    
    var expected = [
      { sellIn: -1, quality: 38},
      { sellIn: -1, quality: 8},
      { sellIn: -2, quality: 18},
      
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  // La qualité (quality) d'un produit ne peut jamais être négative.
  it("perenption passée qualité se degrade 2 fois plus vite", function () {
    listItems.push(new Item("test qualité tjs positive 1", 10, 0));
    listItems.push(new Item("test qualité tjs positive 2", 20, 0));
    
    
    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();
    
    var expected = [
      { sellIn: 9, quality: 0},
      { sellIn: 19, quality: 0},
      
    
      
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  // les éléments "Conjured" voient leur qualité se dégrader deux fois plus vite que les objets normaux.
  it("perenption passée qualité se degrade 2 fois plus vite", function () {
    listItems.push(new Item('Conjured', 10, 20));
    listItems.push(new Item('Conjured', 20, 30));
    
    
    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();
    
    var expected = [
      { sellIn: 9, quality: 18},
      { sellIn: 19, quality: 28},
      
    
      
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

 
});
  
