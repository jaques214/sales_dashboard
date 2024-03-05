'use client';

import * as React from 'react';
import { Chart as ChartJS, Tooltip, ChartOptions, Title, CategoryScale, LinearScale, LineElement, Legend, PointElement, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, Tooltip, Title, Legend, CategoryScale, LinearScale, PointElement, Filler);

export function LineChart({ lineData }: { lineData: number[] }) {
    const data = {
        labels: ['jan', 'fev', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
        datasets: [
            {
                data: lineData,
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.5
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        elements: {
            point: {
                backgroundColor: "#ff5e80",
                pointStyle: 'circle'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#fff',
                }
            },
            y: {
                ticks: {
                    stepSize: 100000,
                    color: '#fff',
                    callback: (label) => label.toLocaleString("pt-PT", { style: "currency", currency: "EUR" }),
                }
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#fff'
                },
            },
            title: {
                display: true,
                color: "#fff",
                position: "top",
                text: 'Sales per Month',
                font: {
                    size: 24
                },
                fullSize: true,
                padding: {
                    top: 10,
                    bottom: 20
                }
            }
        }
    }

    return <Line options={options} data={data} />;
}