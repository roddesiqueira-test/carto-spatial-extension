-----------------------------------------------------------------------
--
-- Copyright (C) 2021 CARTO
--
-----------------------------------------------------------------------

CREATE OR REPLACE FUNCTION `@@BQ_PROJECTID@@.@@BQ_DATASET_PLACEKEY@@.__H3_ASPLACEKEY`(h3Index STRING)
    RETURNS STRING
    DETERMINISTIC
    LANGUAGE js
    OPTIONS (library=["@@PLACEKEY_BQ_LIBRARY@@"])
AS """
    return h3ToPlacekey(h3Index);
""";

CREATE OR REPLACE FUNCTION `@@BQ_PROJECTID@@.@@BQ_DATASET_PLACEKEY@@.H3_ASPLACEKEY`(h3Index STRING)
    RETURNS STRING
AS
(
    IF(`@@BQ_PROJECTID@@.@@BQ_DATASET_H3@@.ISVALID`(h3Index),
      `@@BQ_PROJECTID@@.@@BQ_DATASET_PLACEKEY@@.__H3_ASPLACEKEY`(h3Index),
      null)
);