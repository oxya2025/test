import axios from "axios";
import fs from "fs";

const TWSE =
    "https://openapi.twse.com.tw/v1/opendata/t187ap03_L";

const TPEX =
    "https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap03_O";

async function loadTWSE(){

    const {data}=await axios.get(TWSE);

    return data.map(x=>({

        market:"上市",

        date:x["出表日期"],

        stockNo:x["公司代號"],

        companyName:x["公司名稱"],

        shortName:x["公司簡稱"],

        listingDate:x["上市日期"],

        website:x["網址"],

        shares:Number(
            x["已發行普通股數或TDR原股發行股數"]
        )||0

    }));

}

async function loadTPEX(){

    const {data}=await axios.get(TPEX);

    return data.map(x=>({

        market:"上櫃",

        date:x["Date"],

        stockNo:x["SecuritiesCompanyCode"],

        companyName:x["CompanyName"],

        shortName:x["CompanyAbbreviation"],

        listingDate:x["DateOfListing"],

        website:x["WebAddress"],

        shares:Number(
            x["IssueShares"]
        )||0

    }));

}

async function main(){

    const twse=await loadTWSE();

    const tpex=await loadTPEX();

    const stocks=[
        ...twse,
        ...tpex
    ];

    stocks.sort((a,b)=>
        a.stockNo.localeCompare(b.stockNo)
    );

    const output={

        lastupdate:new Date().toISOString(),

        count:stocks.length,

        data:stocks

    };

    fs.mkdirSync("./api",{
        recursive:true
    });

    fs.writeFileSync(

        "./api/stocks.json",

        JSON.stringify(
            output,
            null,
            2
        ),

        "utf8"

    );

    console.log("完成："+stocks.length);

}

main();
