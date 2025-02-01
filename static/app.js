const app = Vue.createApp({
    data() {
        return {
            keyword: '',
            suggestions: [],
            highlightedIndex: -1  // Track which suggestion is highlighted
        };
    },
    methods: {
        search() {
            if (this.keyword.length < 1) {
                this.suggestions = [];
                return;
            }

            fetch('/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ keyword: this.keyword })
            })
            .then(response => response.json())
            .then(data => {
                this.suggestions = data.suggestions;
                this.highlightedIndex = -1;  // Reset highlight index
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
            });
        },
        selectSuggestion(suggestion) {
            this.keyword = suggestion;  // Set input value to the clicked suggestion
            this.suggestions = [];  // Clear suggestions
        },
        highlightNext() {
            if (this.highlightedIndex < this.suggestions.length - 1) {
                this.highlightedIndex++;
            }
        },
        highlightPrev() {
            if (this.highlightedIndex > 0) {
                this.highlightedIndex--;
            }
        },
        selectHighlighted() {
            if (this.highlightedIndex >= 0) {
                this.selectSuggestion(this.suggestions[this.highlightedIndex]);
            }
        }
    }
});

app.mount('#app');
