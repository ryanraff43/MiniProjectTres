import salaryAndAcceptanceGraph from "./salary_acceptance.js";
import salaryAndPriceGraph from "./salary_price.js";

export default function pieChart(data) {

    const margin = {top:20, left:50, right:20, bottom:20};

    const width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    d3.select('.pieChartBase').remove();

    const svg = d3.select('.pieChart').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "pieChartBase");

    const arcArea = svg.append("g")
        .attr("transform", "translate("+(width+margin.left+margin.right)/2+" 150)")
        .attr("class", ".arcArea");

    var color = d3.scaleOrdinal(["steelblue", "coral"]);

    const radius = 90;

    // Generate the arcs
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const labelArc = d3.arc()
        .outerRadius(200)
        .innerRadius(100);

    console.log("arc ", arc);

    //const arcArea = svg.append("g").attr("transform", "translate("+width/2+" 70)");

    console.log('college data ', data);
    const collegeData = data;

    let totalPub = 0;
    let totalPriv = 0;

    collegeData.forEach(function(d) {
        if (d.Public_Private == "Public") 
            totalPub += 1;
        else
            totalPriv += 1;
      });
    
    let totPubPriv = totalPub + totalPriv;
    let percPub = Math.round(((totalPub/totPubPriv)*10000)/100);
    let percPriv = Math.round(((totalPriv/totPubPriv)*10000)/100);

    const pubPriv = [{type: "Public", value: percPub}, {type: "Private", value: percPriv}];

    //console.log("pubpriv ", pubPriv);
  
    // Generate the pie
    const pie = d3.pie().value(function(d) {console.log(d); return d.value; });

    //console.log("pie ", pie);

    //Generate groups
    const arcs = pie(pubPriv);

    const pieGroup = arcArea.selectAll(".pieGroup")
        .data(arcs)
        .enter()
        .append("g")
        .attr("class", "pieGroup");

   pieGroup
        .append("path")
        .attr("fill", d=>color(d.value))
        .attr("stroke", "white")
        .attr("d", arc)
        .on("mouseover", function(event, d) {
            console.log("MOUSED");
            d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.85');

            let xPosition = width/2 + 30;
            let yPosition = 150;

            //Update the tooltip position and value
            d3.select("#pieTooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#value")
                .text(d.value+"%");

            //Show the tooltip
            d3.select("#pieTooltip").classed("hidden", false);
        })
        .on("mouseout", function(d) {
            d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1');
            //Hide the tooltip
            d3.select("#pieTooltip").classed("hidden", true);
          })
        .on("click", function(d, i) {
            // Do something after clicking a bar
                //console.log("CLICKED");
                let valueType = i.data.type;
                //console.log("d ", d);
                //console.log("i ", i.data.type);
                let newData =  data.filter(d=>d.Public_Private == valueType);

                salaryAndAcceptanceGraph(newData);
                salaryAndPriceGraph(newData);

            });

    pieGroup
        .append("text")
        .attr("transform", function(d) { 
                console.log
                return "translate(" + labelArc.centroid(d) + ")"; 
        })
        .text(function(d) { return d.data.type; });
}