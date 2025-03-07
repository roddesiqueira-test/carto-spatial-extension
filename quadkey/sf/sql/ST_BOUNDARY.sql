-----------------------------------------------------------------------
--
-- Copyright (C) 2021 CARTO
--
-----------------------------------------------------------------------

CREATE OR REPLACE FUNCTION @@SF_DATABASEID@@.@@SF_SCHEMA_QUADKEY@@._GEOJSONBOUNDARY_FROMQUADINT
    (quadint STRING)
    RETURNS STRING
    LANGUAGE JAVASCRIPT
AS $$
    @@LIBRARY_FILE_CONTENT@@
    
    if(!QUADINT)
    {
        throw new Error('NULL argument passed to UDF');
    }

    let geojson = quadintToGeoJSON(QUADINT);
    return JSON.stringify(geojson);
$$;

CREATE OR REPLACE SECURE FUNCTION @@SF_DATABASEID@@.@@SF_SCHEMA_QUADKEY@@.ST_BOUNDARY
    (quadint BIGINT)
    RETURNS GEOGRAPHY
AS $$
    TRY_TO_GEOGRAPHY(@@SF_DATABASEID@@.@@SF_SCHEMA_QUADKEY@@._GEOJSONBOUNDARY_FROMQUADINT(CAST(QUADINT AS STRING)))
$$;