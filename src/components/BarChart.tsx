'use client';

import * as React from 'react';
import { Chart as ChartJS, Tooltip, ChartOptions, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, Tooltip, Title, CategoryScale, LinearScale);

type BarData = {
    labels: string[],
    datasets: [
        {
            data: number[],
            barPercentage: number,
            barThickness: number,
            maxBarThickness: number,
            minBarLength: number,
        },
    ],
};

export function BarChart({ barData }: { barData: number[] }) {
    const data: BarData = {
        labels: ['jan', 'fev', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
        datasets: [
            {
                data: barData,
                barPercentage: 0.5,
                barThickness: 6,
                maxBarThickness: 8,
                minBarLength: 2,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        scales: {
            y: {
              beginAtZero: true
            }
        },
        responsive: true,
        plugins: {
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

    return <Bar options={options} data={data} />;
}