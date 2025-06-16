import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CFHeatmap({ handle }) {
  const heatmapRef = useRef();

  useEffect(() => {
    if (!handle || !heatmapRef.current) return;

    let mounted = true;
    const container = d3.select(heatmapRef.current);

    // Clean previous renders
    container.selectAll('*').remove();

    const drawHeatmap = async () => {
      try {
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&status=OK`);
        const data = await res.json();
        if (!mounted) return;

        const submissions = data.result.filter(sub => sub.verdict === 'OK');
        const dateMap = new Map();
        submissions.forEach(sub => {
          const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
          dateMap.set(date, (dateMap.get(date) || 0) + 1);
        });

        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        const dates = d3.timeDays(lastYear, today);

        const cellSize = 15;
        const width = 53 * cellSize + 50;
        const height = 7 * cellSize + 30;

        const svg = container.append('svg')
          .attr('width', width)
          .attr('height', height);

        const months = d3.timeMonths(lastYear, today);
        svg.selectAll('text.month')
          .data(months)
          .enter()
          .append('text')
          .attr('x', d => d3.timeWeek.count(lastYear, d) * cellSize + 30)
          .attr('y', 10)
          .attr('font-size', '10px')
          .attr('fill', '#666')
          .text(d => d.toLocaleString('default', { month: 'short' }));

        svg.selectAll('rect')
          .data(dates)
          .enter()
          .append('rect')
          .attr('x', d => d3.timeWeek.count(lastYear, d) * cellSize + 30)
          .attr('y', d => d.getDay() * cellSize + 15)
          .attr('width', cellSize - 1)
          .attr('height', cellSize - 1)
          .attr('fill', d => {
            const key = d.toISOString().split('T')[0];
            const count = dateMap.get(key) || 0;
            return count === 0 ? '#ebedf0' :
              count < 2 ? '#c6e48b' :
              count < 4 ? '#7bc96f' :
              count < 6 ? '#239a3b' : '#196127';
          })
          .append('title')
          .text(d => {
            const key = d.toISOString().split('T')[0];
            return `${key}: ${dateMap.get(key) || 0} submissions`;
          });
      } catch (error) {
        console.error("Heatmap error:", error);
      }
    };

    drawHeatmap();

    return () => {
      mounted = false;
      container.selectAll('*').remove();
    };
  }, [handle]);

  return (
    <div
      ref={heatmapRef}
      style={{
        marginTop: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        background: '#fff',
        overflowX: 'auto',
        maxWidth: '100%',
        minHeight: '130px'
      }}
    />
  );
}
