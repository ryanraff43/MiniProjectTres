export default function salaryAndAcceptanceGraph(data) {

    console.log('hello');
  
    const margin = ({top: 40, right: 60, bottom: 40, left: 60});
    
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    d3.select('.acceptanceChartBase').remove();

    const svg = d3.select('.acceptanceChart')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .attr("class", "acceptanceChartBase")
                    .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);
                    // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    // d3.csv('universities.csv', d3.autoType).then(data=>{
        const xScale = d3.scaleLinear()
                        .domain(d3.extent(data, d=> d.Acceptance_Rate))
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
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d=>xScale(d.Acceptance_Rate))
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

                console.log("acceptance rate ", d.Acceptance_Rate);
                let name = d.Name;
                let rank = d.Rank;
                let publicPrivate = d.Public_Private;
                let acceptanceRate = (d.Acceptance_Rate)+"%";
                let alumniSalary = d3.format('($,.0f')(d.Alumni_Salary);
                let undergradPop = d3.format(',.0f')(d.Undergraduate_Population);
    
                const pos = d3.pointer(event, window);
                d3.select('#acceptanceTooltip')
                    .style('left', (pos[0]-200)+'px')
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
                        'Acceptance Rate: ' + acceptanceRate + '<br/>' +
                        'Median Alumni Salary: ' + alumniSalary + '<br/>' +
                        'Undergraduate Population: ' + undergradPop
                    );
            })
            .on('mouseleave', function(event, d) {
                d3.select('#acceptanceTooltip')
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
            .call(yAxis);
    
        svg.append('text')
            .attr('x', width/2)
            .attr('y', height + margin.top - 5)
            .text('Acceptance Rate (%)');
    
        svg.append('text')
            .attr('x', -50)
            .attr('y', height/2 - margin.top)
            .text('Median Alumni Salary')
            .attr('writing-mode', 'vertical-lr');
    }
    
    