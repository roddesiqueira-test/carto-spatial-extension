const assert = require('assert').strict;
const {BigQuery} = require('@google-cloud/bigquery');

const BQ_PROJECTID = process.env.BQ_PROJECTID;
const BQ_DATASET_QUADKEY = process.env.BQ_DATASET_QUADKEY;

describe('KRING integration tests', () => {
    const queryOptions = { 'timeoutMs' : 30000 };
    let client;
    before(async () => {
        if (!BQ_PROJECTID) {
            throw "Missing BQ_PROJECTID env variable";
        }
        if (!BQ_DATASET_QUADKEY) {
            throw "Missing BQ_DATASET_QUADKEY env variable";
        }
        client = new BigQuery({projectId: `${BQ_PROJECTID}`});
    });
 
    it ('KRING should work', async () => {
        let query = `SELECT \`${BQ_PROJECTID}\`.\`${BQ_DATASET_QUADKEY}\`.KRING(162,1) as kring1,
        \`${BQ_PROJECTID}\`.\`${BQ_DATASET_QUADKEY}\`.KRING(12070922,1) as kring2,
        \`${BQ_PROJECTID}\`.\`${BQ_DATASET_QUADKEY}\`.KRING(791040491538,1) as kring3,
        ARRAY(SELECT CAST(num AS STRING) FROM UNNEST(\`${BQ_PROJECTID}\`.\`${BQ_DATASET_QUADKEY}\`.KRING(12960460429066265,NULL)) num)as kring4,
        \`${BQ_PROJECTID}\`.\`${BQ_DATASET_QUADKEY}\`.KRING(12070922,2) as kring5,
        \`${BQ_PROJECTID}\`.\`${BQ_DATASET_QUADKEY}\`.KRING(791040491538,3) as kring6,`;
        await assert.doesNotReject( async () => {
            [rows] = await client.query(query, queryOptions);
        });
        assert.equal(rows.length, 1);
        assert.equal(rows[0].kring1.length, 9)
        assert.deepEqual(rows[0].kring1.sort().map(String), ['130', '162', '194',
            '2', '258', '290',
            '322', '34', '66']);
        assert.equal(rows[0].kring2.length, 9)
        assert.deepEqual(rows[0].kring2.sort().map(String), ['12038122', '12038154',
            '12038186', '12070890',
            '12070922', '12070954',
            '12103658', '12103690',
            '12103722']);
        assert.equal(rows[0].kring3.length, 9)
        assert.deepEqual(rows[0].kring3.sort().map(String), ['791032102898',
            '791032102930',
            '791032102962',
            '791040491506',
            '791040491538',
            '791040491570',
            '791048880114',
            '791048880146',
            '791048880178']);
        assert.equal(rows[0].kring4.length, 9)
        assert.deepEqual(rows[0].kring4.sort(), ['12960459355324409',
            '12960459355324441',
            '12960459355324473',
            '12960460429066233',
            '12960460429066265',
            '12960460429066297',
            '12960461502808057',
            '12960461502808089',
            '12960461502808121']);
        assert.equal(rows[0].kring5.length, 25)
        assert.deepEqual(rows[0].kring5.sort().map(String), ['12005322', '12005354', '12005386',
            '12005418', '12005450', '12038090',
            '12038122', '12038154', '12038186',
            '12038218', '12070858', '12070890',
            '12070922', '12070954', '12070986',
            '12103626', '12103658', '12103690',
            '12103722', '12103754', '12136394',
            '12136426', '12136458', '12136490',
            '12136522']);
        assert.equal(rows[0].kring6.length, 49)
        assert.deepEqual(rows[0].kring6.sort().map(String), ['791015325618', '791015325650', '791015325682',
            '791015325714', '791015325746', '791015325778',
            '791015325810', '791023714226', '791023714258',
            '791023714290', '791023714322', '791023714354',
            '791023714386', '791023714418', '791032102834',
            '791032102866', '791032102898', '791032102930',
            '791032102962', '791032102994', '791032103026',
            '791040491442', '791040491474', '791040491506',
            '791040491538', '791040491570', '791040491602',
            '791040491634', '791048880050', '791048880082',
            '791048880114', '791048880146', '791048880178',
            '791048880210', '791048880242', '791057268658',
            '791057268690', '791057268722', '791057268754',
            '791057268786', '791057268818', '791057268850',
            '791065657266', '791065657298', '791065657330',
            '791065657362', '791065657394', '791065657426',
            '791065657458']);
    });

    it ('KRING should fail with NULL argument', async () => {
        let rows;
        let query = `SELECT \`${BQ_PROJECTID}\`.\`${BQ_DATASET_QUADKEY}\`.KRING(NULL);`;
        await assert.rejects( async () => {
            [rows] = await client.query(query, queryOptions);
        });
    });
}); /* QUADKEY integration tests */
