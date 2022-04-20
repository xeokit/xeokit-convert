const PercyScript = require('@percy/script');
const httpServer = require('http-server');

PercyScript.run(async (page, percySnapshot) => {

    async function testPage(pageName) {
        await page.goto('http://localhost:3001/' + pageName);
        await page.waitForFunction(() => !!document.querySelector('#percyLoaded'));
        await percySnapshot(pageName, {
            widths: [1280]
        });
    }

    let server = httpServer.createServer();

    server.listen(3001);

    console.log(`Server started`);

    try {
        // Programmatically generating XKT

        await testPage('./visualTests/test_generate_batching_lines.html');
        await testPage('./visualTests/test_generate_batching_points.html');
        await testPage('./visualTests/test_generate_batching_triangles.html');
        await testPage('./visualTests/test_generate_batching_stairCase.html');
        await testPage('./visualTests/test_generate_batching_stairCase_autoNormals.html');

        await testPage('./visualTests/test_generate_instancing_lines.html');
        await testPage('./visualTests/test_generate_instancing_points.html');
        await testPage('./visualTests/test_generate_instancing_triangles.html');
        await testPage('./visualTests/test_generate_instancing_stairCase.html');
        await testPage('./visualTests/test_generate_instancing_stairCase_autoNormals.html');

        // PBR

        await testPage('./visualTests/test_generate_batching_PBR_metallicVsRoughness.html');
        await testPage('./visualTests/test_generate_instancing_PBR_metallicVsRoughness.html');

        // glTF -> XKT

        await testPage('./visualTests/test_convert_glTF_embedded_Duplex.html');
        await testPage('./visualTests/test_convert_glTF_embedded_IfcOpenHouse2x3.html');
        await testPage('./visualTests/test_convert_glTF_embedded_IfcOpenHouse4.html');

        // IFC -> XKT

        await testPage('./visualTests/test_convert_IFC_IfcOpenHouse2x3.html');
        await testPage('./visualTests/test_convert_IFC_IfcOpenHouse4.html');

        // LAZ -> XKT

        await testPage('./visualTests/test_convert_LAZ_Autzen.html');
        await testPage('./visualTests/test_convert_LAZ_IndoorScan.html');

        // CityJSON -> XKT

        await testPage('./visualTests/test_convert_CityJSON_Railway.html');
        await testPage('./visualTests/test_convert_CityJSON_DenHaag.html');

        // STC -> XKT

        await testPage('./visualTests/test_convert_STL_SpurGear.html');

    } finally {
        server.close();
    }
});

