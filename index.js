'use strict';

var fs = require('fs');
var http = require("http");

var GRIB2CLASS = require('./grib2class');

var allDomains = require('./domains')();


var ParameterLevel = [
        ["snowdensity-Dube141_1h", "", "", "", "", "", "", "", ""],
        ["APCP-006-0700cutoff_SFC_0", "", "", "", "", "", "", "", ""],

        ["PRATE_SFC_0", "", "", "", "", "", "", "", ""],
        ["APCP_SFC_0", "", "", "", "", "", "", "", ""], // accumuative
        ["ARAIN_SFC_0", "", "", "", "", "", "", "", ""], // accumuative
        ["AFRAIN_SFC_0", "", "", "", "", "", "", "", ""], // accumuative
        ["AICEP_SFC_0", "", "", "", "", "", "", "", ""], // accumuative
        ["ASNOW_SFC_0", "", "", "", "", "", "", "", ""], // accumuative

        ["DSWRF_NTAT_0", "", "", "", "", "", "", "", ""], // accumuative
        ["NLWRS_SFC_0", "", "", "", "", "", "", "", ""], // accumuative
        ["NSWRS_SFC_0", "", "", "", "", "", "", "", ""], // accumuative
        ["DLWRF_SFC_0", "", "", "", "", "", "", "", ""], // accumuative
        ["DSWRF_SFC_0", "", "", "", "", "", "", "", ""], // accumuative

        ["USWRF_NTAT_0", "", "", "", "", "", "", "", ""], // not accumuative W/m2
        ["ULWRF_NTAT_0", "", "", "", "", "", "", "", ""], // not accumuative W/m2
        ["SHTFL_SFC_0", "", "", "", "", "", "", "", ""], // not accumuative W/m2
        ["LHTFL_SFC_0", "", "", "", "", "", "", "", ""], // not accumuative W/m2

        ["SHOWA_SFC_0", "", "", "", "", "", "", "", ""],
        ["4LFTX_SFC_0", "", "", "", "", "", "", "", ""],
        ["CAPE_ETAL_10000", "", "", "", "", "", "", "", ""],
        ["HLCY_ETAL_10000", "", "", "", "", "", "", "", ""],

        ["WTMP_SFC_0", "", "", "", "", "", "", "", ""],
        ["ICEC_SFC_0", "", "", "", "", "", "", "", ""],
        ["LAND_SFC_0", "", "", "", "", "", "", "", ""],

        ["SNOD_SFC_0", "", "", "", "", "", "", "", ""],
        ["WEASD_SFC_0", "", "", "", "", "", "", "", ""],
        ["TSOIL_DBLL_10c", "", "", "", "", "", "", "", ""],
        ["VSOILM_DBLL_10c", "", "", "", "", "", "", "", ""],

        ["", "", "", "", "ABSV_ISBL_1000", "ABSV_ISBL_0850", "ABSV_ISBL_0700", "ABSV_ISBL_0500", "ABSV_ISBL_0250"],
        ["", "", "", "", "VVEL_ISBL_1000", "VVEL_ISBL_0850", "VVEL_ISBL_0700", "VVEL_ISBL_0500", "VVEL_ISBL_0250"],
        ["HGT_SFC_0", "", "", "", "HGT_ISBL_1000", "HGT_ISBL_0850", "HGT_ISBL_0700", "HGT_ISBL_0500", "HGT_ISBL_0250"],

        ["TMP_TGL_2", "TMP_TGL_40", "TMP_TGL_80", "TMP_TGL_120", "TMP_ISBL_1000", "TMP_ISBL_0850", "TMP_ISBL_0700", "TMP_ISBL_0500", "TMP_ISBL_0250"],
        ["DPT_TGL_2", "DPT_TGL_40", "DPT_TGL_80", "DPT_TGL_120", "", "", "", "", ""],
        ["DEPR_TGL_2", "DEPR_TGL_40", "DEPR_TGL_80", "DEPR_TGL_120", "DEPR_ISBL_1000", "DEPR_ISBL_0850", "DEPR_ISBL_0700", "DEPR_ISBL_0500", "DEPR_ISBL_0250"],
        ["SPFH_TGL_2", "SPFH_TGL_40", "SPFH_TGL_80", "SPFH_TGL_120", "SPFH_ISBL_1000", "SPFH_ISBL_0850", "SPFH_ISBL_0700", "SPFH_ISBL_0500", "SPFH_ISBL_0250"],
        ["RH_TGL_2", "RH_TGL_40", "RH_TGL_80", "RH_TGL_120", "RH_ISBL_1000", "RH_ISBL_0850", "RH_ISBL_0700", "RH_ISBL_0500", "RH_ISBL_0250"],

        ["UGRD_TGL_10", "UGRD_TGL_40", "UGRD_TGL_80", "UGRD_TGL_120", "UGRD_ISBL_1000", "UGRD_ISBL_0850", "UGRD_ISBL_0700", "UGRD_ISBL_0500", "UGRD_ISBL_0250"],
        ["VGRD_TGL_10", "VGRD_TGL_40", "VGRD_TGL_80", "VGRD_TGL_120", "VGRD_ISBL_1000", "VGRD_ISBL_0850", "VGRD_ISBL_0700", "VGRD_ISBL_0500", "VGRD_ISBL_0250"],
        ["WIND_TGL_10", "WIND_TGL_40", "WIND_TGL_80", "WIND_TGL_120", "WIND_ISBL_1000", "WIND_ISBL_0850", "WIND_ISBL_0700", "WIND_ISBL_0500", "WIND_ISBL_0250"],
        ["WDIR_TGL_10", "WDIR_TGL_40", "WDIR_TGL_80", "WDIR_TGL_120", "WDIR_ISBL_1000", "WDIR_ISBL_0850", "WDIR_ISBL_0700", "WDIR_ISBL_0500", "WDIR_ISBL_0250"],

        ["WVDIR_SFC_0", "", "", "", "", "", "", "", ""],
        ["SWDIR_SFC_0", "", "", "", "", "", "", "", ""],
        ["WVHGT_SFC_0", "", "", "", "", "", "", "", ""],
        ["SWELL_SFC_0", "", "", "", "", "", "", "", ""],
        ["HTSGW_SFC_0", "", "", "", "", "", "", "", ""],
        ["PWPER_SFC_0", "", "", "", "", "", "", "", ""],
        ["WVPER_SFC_0", "", "", "", "", "", "", "", ""],
        ["SWPER_SFC_0", "", "", "", "", "", "", "", ""],

        ["HG_TGL_0", "", "", "", "", "", "", "", ""],
        ["WVX_TGL_0", "", "", "", "", "", "", "", ""],
        ["WVY_TGL_0", "", "", "", "", "", "", "", ""],
        ["WVMD_TGL_0", "", "", "", "", "", "", "", ""],
        ["WVDR_TGL_0", "", "", "", "", "", "", "", ""],
        ["FRO_TGL_0", "", "", "", "", "", "", "", ""],
        ["VCIS_TGL_0", "", "", "", "", "", "", "", ""],
        ["QSP_TGL_0", "", "", "", "", "", "", "", ""],
        ["TDI_TGL_0", "", "", "", "", "", "", "", ""],
        ["TMPIL_TGL_0", "", "", "", "", "", "", "", ""],

        ["PRMSL_MSL_0", "", "", "", "", "", "", "", ""],
        ["PRES_SFC_0", "", "", "", "", "", "", "", ""],
        ["HGT", "", "", "", "", "", "", "", ""], // cloud ceiling
        ["HGT", "", "", "", "", "", "", "", ""], // cloud top
        ["HCDC_SFC_0", "", "", "", "", "", "", "", ""],
        ["MCDC_SFC_0", "", "", "", "", "", "", "", ""],
        ["LCDC_SFC_0", "", "", "", "", "", "", "", ""],
        ["TCDC_SFC_0", "", "", "", "", "", "", "", ""],
        ["ALBDO_SFC_0", "", "", "", "", "", "", "", ""],

        ["SOLAR_HOR", "", "", "", "", "", "", "", ""], // to be post-processed
        ["SOLAR_DIF", "", "", "", "", "", "", "", ""], // to be post-processed
        ["SOLAR_DIR", "", "", "", "", "", "", "", ""], // to be post-processed

        ["EFFECT_DIR", "", "", "", "", "", "", "", ""], // to be post-processed
        ["EFFECT_DIF", "", "", "", "", "", "", "", ""], // to be post-processed

        ["SOLAR_TRK", "", "", "", "", "", "", "", ""], // to be post-processed
        ["SOLAR_LAT", "", "", "", "", "", "", "", ""], // to be post-processed
        ["SOLAR_S45", "", "", "", "", "", "", "", ""], // to be post-processed
        ["SOLAR_S00", "", "", "", "", "", "", "", ""], // to be post-processed
        ["SOLAR_N00", "", "", "", "", "", "", "", ""], // to be post-processed
        ["SOLAR_E00", "", "", "", "", "", "", "", ""], // to be post-processed
        ["SOLAR_W00", "", "", "", "", "", "", "", ""], // to be post-processed

        ["WPOW_TGL_10", "WPOW_TGL_40", "WPOW_TGL_80", "WPOW_TGL_120", "WPOW_ISBL_1000", "WPOW_ISBL_0850", "WPOW_ISBL_0700", "WPOW_ISBL_0500", "WPOW_ISBL_0250"], // to be post-processed

        ["FLOWxONLY_TGL_10", "FLOWxONLY_TGL_40", "FLOWxONLY_TGL_80", "FLOWxONLY_TGL_120", "FLOWxONLY_ISBL_1000", "FLOWxONLY_ISBL_0850", "FLOWxONLY_ISBL_0700", "FLOWxONLY_ISBL_0500", "FLOWxONLY_ISBL_0250"], // to be post-processed
        ["FLOWxPRM_TGL_10", "FLOWxPRM_TGL_40", "FLOWxPRM_TGL_80", "FLOWxPRM_TGL_120", "FLOWxPRM_ISBL_1000", "FLOWxPRM_ISBL_0850", "FLOWxPRM_ISBL_0700", "FLOWxPRM_ISBL_0500", "FLOWxPRM_ISBL_0250"], // to be post-processed
        ["FLOWxPCP_TGL_10", "FLOWxPCP_TGL_40", "FLOWxPCP_TGL_80", "FLOWxPCP_TGL_120", "FLOWxPCP_ISBL_1000", "FLOWxPCP_ISBL_0850", "FLOWxPCP_ISBL_0700", "FLOWxPCP_ISBL_0500", "FLOWxPCP_ISBL_0250"], // to be post-processed
        ["FLOWxEFF_TGL_10", "FLOWxEFF_TGL_40", "FLOWxEFF_TGL_80", "FLOWxEFF_TGL_120", "FLOWxEFF_ISBL_1000", "FLOWxEFF_ISBL_0850", "FLOWxEFF_ISBL_0700", "FLOWxEFF_ISBL_0500", "FLOWxEFF_ISBL_0250"], // to be post-processed

];


/*
var DOMAIN = {
        PROPERTY00: 0, // desirable name for model outside program
        PROPERTY01: 1, // type of model
        PROPERTY02: 2,
        PROPERTY03: 3,
        PROPERTY04: 4,
        PROPERTY05: 5,
        PROPERTY06: 6,
        PROPERTY07: 7,
        PROPERTY08: 8,
        PROPERTY09: 9,
        PROPERTY10: 10,
        PROPERTY11: 11
};

var Current_domainID = -1;

var num_Levels = 0;
function addLevel() {
        num_Levels += 1;
        return (num_Levels - 1);
}

var LEVEL_surface = addLevel();
var LEVEL_40m = addLevel();
var LEVEL_80m = addLevel();
var LEVEL_120m = addLevel();
var LEVEL_ISBL_1000 = addLevel();
var LEVEL_ISBL_0850 = addLevel();
var LEVEL_ISBL_0650 = addLevel();
var LEVEL_ISBL_0450 = addLevel();
var LEVEL_ISBL_0250 = addLevel();

var num_Layers = 0;
function addLayer() {
        num_Layers += 1;
        return (num_Layers - 1);
}

var LAYER_pastsnow = addLayer();
var LAYER_pastprecip = addLayer();
var LAYER_preciprate = addLayer();
var LAYER_precipitation = addLayer();
var LAYER_rain = addLayer();
var LAYER_freezingrain = addLayer();
var LAYER_icepellets = addLayer();
var LAYER_snow = addLayer();

var LAYER_solarcomingshort = addLayer();
var LAYER_solarabsrbdlong = addLayer();
var LAYER_solarabsrbdshort = addLayer();
var LAYER_solardownlong = addLayer();
var LAYER_solardownshort = addLayer();
var LAYER_solaruplong = addLayer();
var LAYER_solarupshort = addLayer();
var LAYER_surfsensibleheat = addLayer();
var LAYER_surflatentheat = addLayer();

var LAYER_surfshowalter = addLayer();
var LAYER_surflifted = addLayer();

var LAYER_convpotenergy = addLayer();
var LAYER_surfhelicity = addLayer();

var LAYER_watertemperature = addLayer();
var LAYER_ice = addLayer();
var LAYER_land = addLayer();

var LAYER_depthsnow = addLayer();
var LAYER_watersnow = addLayer();
var LAYER_soiltemperature = addLayer();
var LAYER_soilmoisture = addLayer();

var LAYER_absolutevorticity = addLayer();
var LAYER_verticalvelocity = addLayer();
var LAYER_height = addLayer();

var LAYER_drybulb = addLayer();
var LAYER_dewpoint = addLayer();
var LAYER_depression = addLayer();
var LAYER_spchum = addLayer();
var LAYER_relhum = addLayer();

var LAYER_windU = addLayer();
var LAYER_windV = addLayer();
var LAYER_windspd = addLayer();
var LAYER_winddir = addLayer();

var LAYER_windwavedirtrue = addLayer();
var LAYER_swellwavedirtrue = addLayer();
var LAYER_windwavesheight = addLayer();
var LAYER_swellwavesheight = addLayer();
var LAYER_combwavesheight = addLayer();
var LAYER_peakwaveperiod = addLayer();
var LAYER_windwaveperiod = addLayer();
var LAYER_swellwaveperiod = addLayer();

var LAYER_Water_level_above_mean_sea_level = addLayer();
var LAYER_X_component_of_the_water_velocity = addLayer();
var LAYER_Y_component_of_the_water_velocity = addLayer();
var LAYER_Modulus_of_the_water_velocity = addLayer();
var LAYER_Direction_of_the_water_velocity = addLayer();
var LAYER_Froude_number = addLayer();
var LAYER_Shear_of_the_water_velocity = addLayer();
var LAYER_Specific_discharge = addLayer();
var LAYER_Water_Transport_Diffusion_Index = addLayer();
var LAYER_Water_temperature = addLayer();

var LAYER_meanpressure = addLayer();
var LAYER_surfpressure = addLayer();
var LAYER_cloudceiling = addLayer();
var LAYER_cloudtop = addLayer();
var LAYER_cloudhigh = addLayer();
var LAYER_cloudmiddle = addLayer();
var LAYER_cloudlow = addLayer();
var LAYER_cloudcover = addLayer();
var LAYER_albedo = addLayer();
//---------------------------
var NumberOfRawDataLayers = LAYER_albedo;
//---------------------------
var LAYER_glohorrad = addLayer();
var LAYER_difhorrad = addLayer();
var LAYER_dirnorrad = addLayer();
var LAYER_dirnoreff = addLayer();
var LAYER_difhoreff = addLayer();
var LAYER_tracker = addLayer();
var LAYER_fixlat = addLayer();
var LAYER_south45 = addLayer();
var LAYER_south00 = addLayer();
var LAYER_north00 = addLayer();
var LAYER_east00 = addLayer();
var LAYER_west00 = addLayer();

var LAYER_windpower = addLayer();
var LAYER_flowXonly = addLayer();
var LAYER_flowXmeanpressure = addLayer();
var LAYER_flowXprecipitation = addLayer();
var LAYER_flowXdirecteffect = addLayer();
*/
var DATA = {
        ModelYear: -1,
        ModelMonth: -1,
        ModelDay: -1,

        ModelRun: -1,
        ModelTime: -1, // i.e. forecast hour
        ModelBegin: -1,
        ModelStep: -1,
        ModelEnd: -1,

        numLevels: -1,
        numLayers: -1,
        numMembers: -1,
        numTimes: -1, // download n grib2 files in front

        allLayers: [],
        allLevels: [],
        allDomains: allDomains,
        ParameterLevel: ParameterLevel,

        Filename: ""
};









//var link = "http://dd.weather.gc.ca/model_hrdps/continental/grib2/00/000/CMC_hrdps_continental_TMP_TGL_80_ps2.5km_2019070900_P000-00.grib2";
var link = "http://dd.weather.gc.ca/model_gem_regional/10km/grib2/18/000/CMC_reg_TMP_TGL_2_ps10km_2019070818_P000.grib2";
//var link = "https://nomads.ncep.noaa.gov/cgi-bin/filter_hrrr_2d.pl?file=hrrr.t00z.wrfsfcf00.grib2&lev_2_m_above_ground=on&var_TMP=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&showurl=&dir=%2Fhrrr.20190709%2Fconus";
//var link = "./temp/grib2/hrrr.grib2" // should save a NCEP grib2 file from grib filter links here https://nomads.ncep.noaa.gov/

DATA.numMembers = 1; // i.e. deterministic

var BaseFolder = ".";
var TempFolder = BaseFolder + "/temp/";
var OutputFolder = BaseFolder + "/output/";

var myGrid = new GRIB2CLASS(DATA, {
        TempFolder: TempFolder,
        OutputFolder: OutputFolder
});

function startsWith(all, sub) {
        return all.substring(0, sub.length) === sub;
}

if (startsWith(link, "https://")) {
        console.log("Https is not supported yet!");
}
else if (startsWith(link, "http://")) {
        http.get(link, function (res) {
                var allChunks = [];
                res.on("data", function (chunk) {
                        allChunks.push(chunk);
                });
                res.on("end", function () {
                        myGrid.parse(Buffer.concat(allChunks));
                });
        });
}
else { // local file
        fs.readFile(link, null, function(err, bytes) {
                myGrid.parse(bytes);
        });
}
