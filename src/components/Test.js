import * as d3 from "d3";
import { forceRadial } from "d3";
import { useEffect, useState,useRef } from "react";

function dragged(event, d) {
  d.x = event.x;
  d.y = event.y;
}

function dragended(event, d) {
  
  d.x = null;
  d.y = null;
}
 
function ZoomableSVG({ children, width, height }) {
  console.log("ZoomableSVG");
  const svgRef = useRef();
  const [k, setK] = useState(0.1);
  const [x, setX] = useState(width/4);
  const [y, setY] = useState(height/8);
  useEffect(() => {
    const zoom = d3.zoom().on("zoom", (event) => {
      const { x, y, k } = event.transform;
      setK(k);
      setX(x);
      setY(y);
    });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} width={width} height={height}
    className="graph has-background-white"
    style={{marginLeft: "auto", marginRight: "auto" }}
    viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
}


function Main() {
  
    const [loading, setLoading] = useState(true);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    // デバイスの横、縦幅を取得
    const { innerWidth: deviceWidth, innerHeight: deviceHeight } = window;
    const svgWidth = 2000;
    const svgHeight = 2000;
  
    useEffect(() => {
      const startSimulation = (nodes, links) => {
        
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
              .forceLink()
              .strength(0.05)
              .distance((d) => {
                //console.log(d);
                return d['length'];
              })
              .id((d) => d.id)
            
          ) //stength:linkの強さ（元に戻る力 distance: linkの長さ
          .force("charge", d3.forceManyBody().strength(-2000)) //引き合う力を設定。
          .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2)) //描画するときの中心を設定
          .force("r", forceRadial(function (d) {
            return d.r;
          }))
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
          ) //x方向に戻る力
         .force(
           "r",
           d3
             .forceRadial()
             .radius(svgHeight*0.5)
             .x(svgWidth / 2)
             .y(svgHeight / 2)
             .strength(0.5)
         );
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
          .on("tick", ticked)

          
        // linkデータをセット
        simulation.force("link").links(links);
  
        function ticked() {
          setNodes(nodes.slice());
          setLinks(links.slice());
        }
      };
  
      const startLineChart = async () => {
        const [nodes, links] = await (async () => {
        const response = await fetch("data/est.json");
        const data = await response.json();
        const res = await fetch("data/label.json");
        const label = await res.json();
        //console.log(label)
        const leavesLength = label.length;
        const nodes = Array();
        const links = Array();
        

        for(let i = 1; i <= 27; i++) {
            let col;
            let r = 10;
            if(i <= leavesLength)  {
            col = "rgb(255, 0, 0)";
        } else {
            col = "rgb(100,100, 100)";
            r = 5;
        }

            const title = i <= leavesLength?label[i-1]['word']:"";
            
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
            target:item.target,
            length:item.length
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
  

    const node = d3.selectAll('g.nodes')
    .call(d3.drag()
              
              .on("drag", (event, d) => (d.x = event.x, d.y = event.y))
              .on("end", (event, d) => (d.x = null, d.y = null))
         );
    if (loading) {
      return <div>loading...</div>;
    }

    
    return (
      <div className="container">
        <ZoomableSVG width={svgWidth} height={svgHeight}>
          <g className="links">
            {links.map((link) => {
              return (
                <line
                  key={link.source.id + "-" + link.target.id}
                  stroke="black"
                  strokeWidth="0.5"
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
        </ZoomableSVG>
      </div>
    );
  }

export default Main;