import * as d3 from "d3";
import { useEffect, useState } from "react";

function Main() {
    const MOBILE_BORDER_SIZE = 599;
  
    const [loading, setLoading] = useState(true);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    // デバイスの横、縦幅を取得
    const { innerWidth: deviceWidth, innerHeight: deviceHeight } = window;
    const svgWidth = 2000;
    const svgHeight = 2000;
  
    useEffect(() => {
      const startSimulation = (nodes, links) => {
        const linkLen = 1;
        const simulation = d3
          .forceSimulation()
          .force(
            "collide",
            d3
              .forceCollide()
              .radius(function (d) {
                return d.r;
              })
              .iterations(0)
          ) //衝突値の設定
          .force(
            "link",
            d3
              .forceLink(0.5)
              .distance((d) => linkLen)
              .id((d) => d.id)
            
          ) //stength:linkの強さ（元に戻る力 distance: linkの長さ
          .force("charge", d3.forceManyBody().strength(-300)) //引き合う力を設定。
          .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2)) //描画するときの中心を設定
          .force(
            "x",
            d3
              .forceX()
              .x(svgWidth / 2)
              .strength(0.5)
          )
          .force(
            "y",
            d3
            .forceY()
            .y(svgHeight/2)
            .strength(0.5)
          ); //x方向に戻る力
        // .force(
        //   "r",
        //   d3
        //     .forceRadial()
        //     .radius(svgHeight * 0.35)
        //     .x(svgWidth / 2)
        //     .y(svgHeight / 2)
        //     .strength(0.5)
        // );
        // .force(
        //   "y",
        //   d3
        //     .forceY()
        //     .y(svgHeight / 2)
        //     .strength(0.2)
        // ); //y方向に戻る力
        simulation
          // forceSimulationの影響下に  desを置く
          .nodes(nodes)
          // 時間経過で動かす
          .on("tick", ticked);
        // linkデータをセット
        simulation.force("link").links(links);
  
        function ticked() {
          setNodes(nodes.slice());
          setLinks(links.slice());
        }
      };
  
      const startLineChart = async () => {
        const [nodes, links] = await (async () => {
            console.log("###");
        const response = await fetch("data/edge_word.json");
        const data = await response.json();
        const res = await fetch("data/label.json");
        const label = await res.json();
        console.log(label)
        const leavesLength = label.length;
        const nodes = Array();
        const links = Array();
        const r = 10;

        for(let i = 1; i <= 1887; i++) {
            let col;
            if(i <= leavesLength)  {
            col = "rgb(255, 0, 0)";
        } else {
            col = "rgb(100,100, 100)";
        }

            const title = i <= leavesLength?label[i-1]['word']:"";
            console.log(title);
            nodes.push({
            id:i,
            r,
            col,
            title
            });
        }

        for(const item of data) {
            links.push({
            source:item.source,
            target:item.target
            });
        }

        return [nodes, links];
        })();

        startSimulation(nodes, links);
        setLoading(false);
      };
      startLineChart();
      // １度だけuseEffect()を実行する
    }, []);
  

  
    if (loading) {
      return <div>loading...</div>;
    }
  
    return (
      <div className="container">
        <svg
          className="graph has-background-white"
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          width={deviceWidth <= MOBILE_BORDER_SIZE ? "100%" : svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
        
          <g className="links">
            {links.map((link) => {
              return (
                <line
                  key={link.source.id + "-" + link.target.id}
                  stroke="black"
                  strokeWidth="1"
                  className="link"
  
                  id="edgepath0"
                  x1={link.source.x}
                  y1={link.source.y}
                  x2={link.target.x}
                  y2={link.target.y}
                ></line>
              );
            })}
          </g>
  
        <g className="nodes">
        {nodes.map((node) => {
            return (
            <circle
                className="node"
                key={node.id}
                r={node.r}
                style={{ fill: node.col }}
                cx={node.x}
                cy={node.y}
                text = {node.title}                
                ></circle>
              );
            })}
          </g>
  
        {nodes.map((node) => {
            return (
            <text
                className="node-label"
                key={node.id}
                textAnchor="middle"
                fill="black"
                fontSize={"10px"}
                x={node.x}
                y={node.y}
            >
            {node.title}
            </text>
            );
        })}
        </svg>
      </div>
    );
  }

export default Main;