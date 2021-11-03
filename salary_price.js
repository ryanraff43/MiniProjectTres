export default function salaryAndPriceGraph(data) {
  
    const margin = ({top: 40, right: 60, bottom: 40, left: 80});
    
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    d3.select('.priceChartBase').remove();
    const svg = d3.select('.priceChart')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .attr("class", "priceChartBase")
                    .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);
                  
        const xScale = d3.scaleLinear()
                        .domain(d3.extent(data, d=> d.Total_Annual_Cost))
                        .range([0, width]);
    
        const yScale = d3.scaleLinear()
                        .domain(d3.extent(data, d=> d.Alumni_Salary))
                        .range([height, 0]);
    
        const color = d3.scaleOrdinal()
                        .domain(data)
                        .range(["steelblue", "coral"]);

        const population = d3.scaleSqrt()
                            .domain(d3.extent(data, d=> d.Undergraduate_Population))
                            .range([0, 20]);
    
        svg.selectAll('circle')
            .exit()
            .remove()
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d=>xScale(d.Total_Annual_Cost))
            .attr('cy', d=>yScale(d.Alumni_Salary))
            .attr('r', 5)
            //.attr('fill', d=>color(d.Public_Private))
            .attr('fill', d=> 
                {if(d.Public_Private === 'Public') {
                    return "steelblue"
                }
                else {
                   return "coral"
                }
            }
                )  
            .attr('opacity', '80%')
            .on('mouseenter', function(event, d) {
                let name = d.Name;
                let rank = d.Rank;
                let publicPrivate = d.Public_Private;
                let netPrice = d3.format('($,.0f')(d.Total_Annual_Cost);
                let alumniSalary = d3.format('($,.0f')(d.Alumni_Salary);
                let undergradPop = d3.format(',.0f')(d.Undergraduate_Population);
    
                const pos = d3.pointer(event, window);
                //console.log("position ", pos);
                d3.select('#priceTooltip')
                    .style('left', pos[0]+'px')
                    .style('top', ()=>{
                        if (pos[1] > 600) {
                            return (pos[1]-600)+"px";
                        } 
                        else {
                            return pos[1]-400+"px";
                        }
                            
                      })
                    .style('position', 'fixed')
                    .style('display', 'block')
                    .style('color', 'white')
                    .style('background-color', 'black')
                    .style('padding', '10px')
                    .html(
                        'School: ' + name + '<br/>' +
                        'Rank: ' + rank + '<br/>' +
                        'Public/Private: ' + publicPrivate + '<br/>' +
                        'Net Price: ' + netPrice + '<br/>' +
                        'Median Alumni Salary: ' + alumniSalary + '<br/>' +
                        'Undergraduate Population: ' + undergradPop
                    );
            })
            .on('mouseleave', function(event, d) {
                d3.select('#priceTooltip')
                    .style('display', 'none');
            });
    
        const xAxis = d3.axisBottom()
                        .scale(xScale)
                        .ticks(5, 's');
    
        const yAxis = d3.axisLeft()
                        .scale(yScale)
                        .ticks(5, 's');
    
        svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', 'translate(0,' + (height) + ')')
            .call(xAxis);
    
        svg.append('g')
            .attr('class', 'axis y-axis')
            .attr('transform', `translate(0, 0)`)
            .call(yAxis);
    
        svg.append('text')
            .attr('x', width/2)
            .attr('y', height + margin.top - 2)
            .text('Total Annual Cost');
    
        svg.append('text')
            .attr('x', -50)
            .attr('y', height/2 - margin.top)
            .text('Median Alumni Salary')
            .attr('writing-mode', 'vertical-lr');
    
            //const regions = [... new Set(data.map(data=>data.Region))]
    
            //const svgLegend = svg.append('g')
            //.attr('class', 'legend')
            //.attr('x', '300px')
            //.attr('y','400px')
            //.attr('height', 100)
            //.attr('width', 100)
       
            
        //svgLegend.selectAll('.legendBlocks')
          //  .data(regions)
           // .enter()
           // .append('rect')
             // .attr('fill', d=>color(d)) 
             // .attr('x', 400)
            //  .attr('y', (d,i)=>(i+1)*25+220+210)
             // .attr('height', '20px')
              //.attr('width','20px')
            
        //svgLegend.selectAll('.legendText')
          //  .data(regions)
           // .enter()
           // .append('text')
            //  .attr('x', 430)
             // .attr('y', (d,i)=>(i+1)*25+235+210)
             // .text(d=>d)
    };

    
 