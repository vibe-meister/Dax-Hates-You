# Dax CRM - Single Page React Application

A humorous Customer Relationship Management (CRM) system built with React that allows you to track people and their "annoyance scores" based on various behaviors. This is a client-side only application with no backend required.

## 🎯 Features

- **People Management**: Track up to 10 people with customizable names and scores
- **Annoyance Tracking**: 30 different annoyances (interrupting, late replies, loud chewing, etc.)
- **Dynamic Scoring**: Base scores (1-10) modified by weighted annoyance penalties
- **Drag & Drop**: Reorder people by dragging their cards
- **Data Persistence**: Saves data to browser's localStorage
- **Import/Export**: Export your data as JSON or import previously saved data
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with TailwindCSS for a clean, modern interface

## 🌐 Live Demo

**Try it now:** [https://vibe-meister.github.io/Dax-Hates-You/](https://vibe-meister.github.io/Dax-Hates-You/)

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vibe-meister/Dax-Hates-You.git
   cd Dax-Hates-You
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The app will automatically open at `http://localhost:3000`
   - If it doesn't open automatically, navigate to the URL manually

## 🎮 How to Use

### Basic Navigation
- **View People**: See all people as cards with their current scores
- **Edit Person**: Click on any person's card to open the editor
- **Reorder**: Drag and drop cards to reorder people
- **Export Data**: Use the "Export" button to download your data as JSON
- **Import Data**: Use the "Import" button to load previously exported data

### Scoring System
- Each person starts with a **base score** (1-10)
- Select **annoyances** for each person to reduce their score
- Each annoyance has a **weight** that determines its impact
- The **computed score** is calculated as: base score - weighted annoyance penalties

### Available Annoyances
The app includes 30 different annoyances with varying weights:
- Interrupting (0.6)
- Late replies (0.8)
- Loud chewing (0.5)
- Micromanaging (1.5)
- Name-dropping (0.6)
- And 25 more...

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
dax-crm/
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # React entry point
│   └── index.css        # TailwindCSS imports
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── README.md           # This file
```

### Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling framework
- **LocalStorage** - Data persistence

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🔧 Customization

### Adding New Annoyances
Edit the `ANNOYANCES` array in `src/App.jsx`:

```javascript
const ANNOYANCES = [
  // Add your custom annoyances here
  { id: 'custom1', label: 'Your Custom Annoyance', weight: 1.0 }
];
```

### Modifying Default People
Edit the `DEFAULT_PEOPLE` array in `src/App.jsx`:

```javascript
const DEFAULT_PEOPLE = [
  { id: 'custom', name: 'Custom Person', isUser: false, baseScore: 5, color: '#ff0000' }
];
```

## 🎨 Styling

The app uses TailwindCSS for styling. You can customize the appearance by:
- Modifying Tailwind classes in the JSX
- Updating the `tailwind.config.js` file
- Adding custom CSS in `src/index.css`

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in your repository settings

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Fun Facts

- The app was originally created as a humorous take on relationship management
- All data is stored locally in your browser - no servers required
- The scoring algorithm uses hyperbolic tangent for smooth score adjustments
- SVG avatars are generated dynamically with initials and colors

## 🐛 Troubleshooting

### Common Issues

**App won't start:**
- Make sure Node.js is installed (version 16+)
- Run `npm install` to install dependencies
- Check that port 3000 is available

**Styling looks broken:**
- Ensure TailwindCSS is properly configured
- Check that `src/index.css` includes Tailwind directives

**Data not saving:**
- Check if localStorage is enabled in your browser
- Try clearing browser cache and reloading

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Ensure all dependencies are installed correctly
3. Try running `npm run build` to check for build errors

---

**Made with ❤️ for Dax** - A client-only CRM that's both functional and fun!
