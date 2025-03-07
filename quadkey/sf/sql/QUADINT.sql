-----------------------------------------------------------------------
--
-- Copyright (C) 2021 CARTO
--
-----------------------------------------------------------------------

CREATE OR REPLACE SECURE FUNCTION @@SF_DATABASEID@@.@@SF_SCHEMA_QUADKEY@@.QUADINT_FROMZXY(z INT, x INT, y INT)
    RETURNS BIGINT
AS $$
    BITOR(BITOR(BITAND(Z, 31), BITSHIFTLEFT(X, 5)), BITSHIFTLEFT(Y, Z + 5))
$$;

CREATE OR REPLACE SECURE FUNCTION @@SF_DATABASEID@@.@@SF_SCHEMA_QUADKEY@@.ZXY_FROMQUADINT(quadint BIGINT)
    RETURNS OBJECT
AS $$
    OBJECT_CONSTRUCT(
        'z', BITAND(QUADINT, 31),
        'x', BITAND(BITSHIFTRIGHT(QUADINT, 5), BITSHIFTLEFT(1, BITAND(QUADINT, 31)) - 1),
        'y', BITSHIFTRIGHT(QUADINT, 5 + BITAND(QUADINT, 31)))
$$;
