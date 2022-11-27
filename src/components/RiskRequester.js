import '../App.css';
import { useEffect, useState } from "react";
import ScatterChart from "../pages/charts/ScatterChart";
import { Scatter } from "react-chartjs-2";
import LineChart from "../pages/charts/LineChart";
import { Line } from "react-chartjs-2";


const RiskRequester = (props) =>{
    const startdate_str = props.s.toString().replace(/-/g,"");
    const enddate_str = props.e.toString().replace(/-/g, "");
    console.log(startdate_str,enddate_str);
    
    //http://127.0.0.1:5000/Dashboard/risk
    // let rawUrl= `http://localhost:8080/Dashboard/detail/risk?sdate=${startdate_str}&edate=${enddate_str}`;
    let rawUrl = `http://localhost:8080/Dashboard/detail/risk?sdate=20211208&edate=20211208`;
    let encodeUrl = encodeURI(rawUrl);
    console.log(encodeUrl);
    

    const [data, setData] = useState([0]);

    const [file_dt, setFile_dt] = useState([]);
    const [z_score, setZ_score] = useState([]);
    const [z_score_safe, setz_score_S] = useState([]);
    const [z_score_risk, setz_score_R] = useState([]);
    const [label, setLabel] = useState([]);

    const getData = async()=>{
        const res = await fetch(encodeUrl, {method: 'GET'})
        .then((res)=>res.json());
        
        let result = JSON.stringify(res);

        let jsondata = (JSON.parse(result));
        // console.log("json? : " + jsondata);

        console.log("risk getdata");
        ///데이터 존재 확인
        let length = jsondata.length;
        console.log(length);
        if(!(enddate_str == 0) && length == 0){
            alert("데이터가 비어있습니다.");
            return;
        }

        for(let i=0; i<length; i++){
            if(!Number.isNaN(parseInt(jsondata[i].FILE_DT))){
                file_dt.push(parseInt(jsondata[i].FILE_DT));
                z_score.push(parseFloat(jsondata[i].z_score));
                label.push(parseInt(jsondata[i].label));
                if(parseInt(jsondata[i].label) == "1"){
                    z_score_risk.push(parseFloat(jsondata[i].z_score_risk));
                }
                else{
                    z_score_safe.push(parseFloat(jsondata[i].z_score_safe));
                }
            }
        }

        // for(let i=0; i<length; i++){
        //     if(parseInt(jsondata[i]) == "1"){
        //         z_score_risk.push(parseFloat(jsondata[i].z_score_risk));
        //     }
        // }
        
         
        //가져온 데이터 넣기
        // setData(jsondata);
        setFile_dt(file_dt);
        setZ_score(z_score);
        setz_score_R(z_score_risk);
        setz_score_S(z_score_safe);
        setLabel(label);

    };
    
    console.log("file_dt: ", file_dt);
    console.log("z_score_risk: ", z_score_risk);
    console.log("z_score_safe: ", z_score_safe);
    console.log("label: ", label);

    useEffect(()=>{ //컴포넌트 렌더링 이후에 데이터 가져오기
        getData();
            
        console.log("risk : useEffect");
    },[encodeUrl])


    //그래프
    const risk = {
    labels: file_dt, 
    datasets: [
        {
            label: 'Safety',
            data: z_score_safe,
            backgroundColor: [
                "#6fba2c"
            ],
            yAxisID:'y',
            position: 'left',
        },
        {
            label: 'Risk',
            data: z_score_risk,
            backgroundColor: [
                "#dc0e0e"
            ],
            yAxisID:'y2',
            position: 'right',
            tension:0.4,
            // grid:false,
        },
    ],
    
    };
    
    const risk_data ={
        labels: file_dt,
        datasets: [
            {
            label: "risk",
            data: z_score,
            backgroundColor: "#7fb39d",
            tension:0.4,
            showLine: false
            },
        ],
    // });
    };
    

    return (
        <div className="risk-chart">
            {/* <ScatterChart chartData={risk}/> */}
            {/* <LineChart chartData={risk}/> */}
            <LineChart chartData={risk_data}/>
        </div>

    );
}

export default RiskRequester;