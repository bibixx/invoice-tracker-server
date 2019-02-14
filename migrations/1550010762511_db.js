exports.up = pgm => {
  pgm.createTable("sellers", {
    id: "id",
    name: {
      type: "varchar(256)",
      notNull: true
    },
    city: {
      type: "varchar(256)",
      notNull: true
    },
    streetAddress: {
      type: "varchar(256)",
      notNull: true
    },
    nip: {
      type: "varchar(64)",
      notNull: true
    },
    zipCode: {
      type: "varchar(32)",
      notNull: true
    },
    isPlaceOfPurchase: {
      type: "Boolean",
      notNull: true
    },
    isSeller: {
      type: "Boolean",
      notNull: true
    },
  });

  pgm.createTable("products", {
    id: "id",
    name: {
      type: "varchar(256)",
      notNull: true
    },
    warrantyLength: {
      type: "smallint",
      notNull: true
    },
    placeOfPurchase: {
      type: "integer",
      notNull: true,
      references: '"sellers"(id)',
    },
    seller: {
      type: "integer",
      notNull: true,
      references: '"sellers"(id)',
    },
    boughtAt: {
      type: "timestamp",
      notNull: true,
    }
  });
};
