'use client';

import * as React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieData = {
    labels: string[],
    datasets: [
        {
            data: number[],
            backgroundColor: string[],
            borderColor: string[],
            borderWidth: number,
        },
    ],
};

export function Chart({ labels, pieData }: { labels: string[], pieData: number[] }) {
    const data: PieData = {
        labels: labels,
        datasets: [
            {
                data: pieData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 20,
                    boxHeight: 20,
                    color: '#fff',
                    font: { size: 12 },
                },
                fullSize: true
            },
            title: {
                display: true,
                color: "#fff",
                text: 'Customers Per City',
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

    return <Pie data={data} options={options} />;
}