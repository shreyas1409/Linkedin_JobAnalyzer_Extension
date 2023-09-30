document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8000/retrieve-data')
        .then(response => response.json())
        .then(skillFrequencies => {
            const skillLabels = Object.keys(skillFrequencies);
            const skillValues = Object.values(skillFrequencies);

            const ctx = document.getElementById('skillChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: skillLabels,
                    datasets: [{
                        label: 'Skill Frequencies',
                        data: skillValues,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Frequency',
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Skills',
                            },
                        },
                    },
                },
            });
        })
        .catch(error => {
            console.error("Error fetching skill frequencies:", error);
        });
});
