# 🧠 Quiz Maker

A modern, responsive quiz creation and sharing platform built with React and TypeScript.

![Quiz Maker Screenshot](https://via.placeholder.com/800x400?text=Quiz+Maker+Screenshot)

## ✨ Features

### 🎯 Quiz Creation
- **Easy Quiz Builder**: Intuitive interface for creating multiple-choice quizzes
- **Customizable Settings**: Set time limits, show/hide correct answers, allow retakes
- **Rich Question Options**: Add explanations and multiple choice answers
- **Real-time Preview**: See how your quiz looks as you build it

### 🚀 Quiz Taking Experience
- **Clean Interface**: Distraction-free quiz taking experience
- **Progress Tracking**: Visual progress bar and question counter
- **Timer Support**: Optional time limits with live countdown
- **Mobile Responsive**: Works perfectly on all devices

### 📊 Analytics & Results
- **Detailed Results**: Comprehensive score breakdown and performance metrics
- **Answer Review**: Optional detailed answer explanations
- **Performance Tracking**: Monitor completion times and accuracy
- **Participant Management**: Track unique participants and attempts

### 🔗 Sharing & Collaboration
- **One-Click Sharing**: Generate shareable links instantly
- **No Registration Required**: Participants can take quizzes without signing up
- **Unique URLs**: Each quiz gets a unique, shareable URL
- **Copy to Clipboard**: Easy link sharing with built-in copy functionality

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for beautiful icons
- **Routing**: React Router DOM for navigation
- **Build Tool**: Vite for fast development and building
- **Storage**: Local Storage for client-side data persistence
- **Notifications**: React Hot Toast for user feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quiz-maker.git
   cd quiz-maker
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
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Usage

### Creating a Quiz

1. Click **"Create Quiz"** on the home page
2. Fill in quiz details (title, description, settings)
3. Add questions with multiple choice answers
4. Mark the correct answer for each question
5. Optionally add explanations
6. Save your quiz

### Sharing a Quiz

1. Go to **"My Quizzes"** 
2. Click **"Share"** next to any quiz
3. The link is automatically copied to your clipboard
4. Share the link via email, social media, or messaging

### Taking a Quiz

1. Click on a shared quiz link
2. Enter your name
3. Read the quiz information
4. Click **"Start Quiz"**
5. Answer each question
6. Submit and view your results

### Managing Quizzes

- **Dashboard**: View detailed analytics for each quiz
- **Edit**: Modify existing quizzes
- **Delete**: Remove quizzes you no longer need
- **Analytics**: Track participant performance and engagement

## 🎨 Features in Detail

### Quiz Creation
- **Multiple Choice Questions**: Support for 4 answer options per question
- **Correct Answer Selection**: Easy radio button selection for correct answers
- **Explanations**: Optional detailed explanations for each question
- **Time Limits**: Set custom time limits in minutes
- **Retake Settings**: Control whether users can retake quizzes
- **Answer Display**: Choose whether to show correct answers after completion

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Progress Indicators**: Visual progress bars and question counters
- **Timer Display**: Live countdown when time limits are set
- **Auto-save**: Quiz progress is saved automatically
- **Instant Feedback**: Real-time validation and error messages

### Analytics
- **Attempt Tracking**: Monitor all quiz attempts
- **Performance Metrics**: Average scores, completion times, and accuracy
- **Participant Management**: Track unique participants and repeat attempts
- **Results Export**: View detailed results for analysis

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Quiz Maker
VITE_APP_DESCRIPTION=Create and share amazing quizzes
```

### Customization
- **Colors**: Modify the Tailwind config to change the color scheme
- **Fonts**: Update the CSS to use different fonts
- **Layout**: Adjust component layouts in the source files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Notifications by [React Hot Toast](https://react-hot-toast.com/)

## 🐛 Bug Reports

If you find a bug, please create an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

## 📈 Roadmap

- [ ] User authentication and accounts
- [ ] Quiz templates and themes
- [ ] Advanced question types (true/false, short answer)
- [ ] Quiz categories and tags
- [ ] Export results to CSV/PDF
- [ ] Integration with learning management systems
- [ ] Collaborative quiz creation
- [ ] Advanced analytics and reporting

---

**Made with ❤️ by [Your Name]**

[Live Demo](https://yourusername.github.io/quiz-maker/) | [Report Bug](https://github.com/yourusername/quiz-maker/issues) | [Request Feature](https://github.com/yourusername/quiz-maker/issues)
