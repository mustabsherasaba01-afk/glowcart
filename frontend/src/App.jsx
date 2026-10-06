import { useState } from 'react';
import { FaBars, FaCheckCircle, FaHeart, FaMagic, FaShoppingCart, FaTimes, FaUser } from 'react-icons/fa';
import { NavLink, Route, Routes } from 'react-router-dom';

const categories = [
  'Cleansers',
  'Moisturizers',
  'Serums',
  'Sunscreen',
  'Masks',
  'Toners',
  'Eye Care',
  'Lip Care',
  'Body Care',
  'Makeup',
];

const products = [
  { name: 'Gentle Hydrating Cleanser', brand: 'GlowLab', price: 1499, oldPrice: 1800, rating: 4.8, tag: 'Featured', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85', category: 'Cleansers', productType: 'Cleanser', skinTypes: ['Dry', 'Sensitive', 'Normal'], concerns: ['Dryness', 'Redness'], sensitivityLevels: ['Slightly Sensitive', 'Very Sensitive'] },
  { name: 'Hydrating Moisturizer', brand: 'Rose & Dew', price: 2199, oldPrice: 2600, rating: 4.9, tag: 'Featured', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85', category: 'Moisturizers', productType: 'Moisturizer', skinTypes: ['Dry', 'Normal', 'Sensitive'], concerns: ['Dryness', 'Redness'], sensitivityLevels: ['Slightly Sensitive', 'Very Sensitive'] },
  { name: 'Vitamin C Serum', brand: 'Luma Care', price: 3099, oldPrice: 3500, rating: 4.8, tag: 'Featured', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85', category: 'Serums', productType: 'Serum', skinTypes: ['Normal', 'Combination', 'Sensitive'], concerns: ['Dark Spots', 'Dullness'], sensitivityLevels: ['Not Sensitive', 'Slightly Sensitive'] },
  { name: 'Daily Sunscreen SPF 50', brand: 'Rose & Dew', price: 2999, oldPrice: 3500, rating: 4.8, tag: 'Featured', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85', category: 'Sunscreen', productType: 'Sunscreen', skinTypes: ['Normal', 'Oily', 'Dry', 'Combination'], concerns: ['Dullness', 'Uneven Texture'], sensitivityLevels: ['Not Sensitive', 'Slightly Sensitive'] },
];

const quizQuestions = [
  {
    id: 'skinType',
    question: "What's your skin type?",
    options: [
      { label: 'Normal', description: 'Balanced, comfortable, and rarely reactive.' },
      { label: 'Dry', description: 'Feels tight or flaky, especially after cleansing.' },
      { label: 'Oily', description: 'Looks shiny and gets greasy throughout the day.' },
      { label: 'Combination', description: 'Oily T-zone with drier cheeks.' },
      { label: 'Sensitive', description: 'Easily flushed, irritated, or uncomfortable.' },
    ],
  },
  {
    id: 'primaryConcern',
    question: 'What is your main skin concern?',
    options: ['Acne', 'Dryness', 'Dark Spots', 'Dullness', 'Fine Lines', 'Redness', 'Uneven Texture', 'Excess Oil'],
  },
  {
    id: 'secondaryConcern',
    question: 'Any other concern?',
    options: ['None', 'Acne', 'Dryness', 'Dark Spots', 'Dullness', 'Fine Lines', 'Redness', 'Uneven Texture'],
  },
  {
    id: 'sensitivity',
    question: 'How sensitive is your skin?',
    options: ['Not Sensitive', 'Slightly Sensitive', 'Very Sensitive'],
  },
  {
    id: 'budget',
    question: "What's your skincare budget?",
    options: ['Under Rs. 1,500', 'Rs. 1,500 – Rs. 3,000', 'Rs. 3,000 – Rs. 5,000', 'Rs. 5,000 – Rs. 10,000', 'Above Rs. 10,000'],
  },
  {
    id: 'preferredProducts',
    question: 'What type of products are you looking for?',
    options: ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Mask', 'Complete Routine'],
  },
];

function getBudgetLimit(budget) {
  if (budget === 'Above Rs. 10,000') return Infinity;
  const amounts = budget.match(/[\d,]+/g)?.map((amount) => Number(amount.replaceAll(',', ''))) ?? [];
  return amounts.at(-1) ?? 0;
}

function getRecommendations(answers) {
  const budgetLimit = getBudgetLimit(answers.budget);

  return products
    .map((product) => {
      let score = 0;
      if (product.skinTypes.includes(answers.skinType)) score += 30;
      if (product.concerns.includes(answers.primaryConcern)) score += 30;
      if (answers.secondaryConcern !== 'None' && product.concerns.includes(answers.secondaryConcern)) score += 15;
      if (product.sensitivityLevels.includes(answers.sensitivity)) score += 10;
      if (answers.preferredProducts.includes('Complete Routine') || answers.preferredProducts.includes(product.productType)) score += 5;
      if (product.price <= budgetLimit) score += 10;

      return { ...product, matchScore: score };
    })
    .sort((first, second) => second.matchScore - first.matchScore)
    .slice(0, 3);
}

function ProductCard({ product }) {
  return (
    <article className="product-card" key={product.name}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-meta">
        <span className="product-brand">{product.brand}</span>
        <h3>{product.name}</h3>
        <div className="product-rating">★ {product.rating}</div>
        <div className="price-row">
          <strong>Rs. {product.price}</strong>
          <span>Rs. {product.oldPrice}</span>
        </div>
        <div className="badge-line">
          <span className="match-tag">{product.matchScore === undefined ? product.tag : `${product.matchScore}% match`}</span>
          <button className="mini-btn" type="button">Add to Cart</button>
        </div>
      </div>
    </article>
  );
}

function HomePage() {
  return (
    <div>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">GlowCart</span>
          <h1>Your Skin Deserves Better.</h1>
          <p>Discover skincare made for your skin, your concerns, and your budget.</p>
          <div className="hero-actions">
            <NavLink to="/quiz" className="primary-btn">Take Skin Quiz</NavLink>
            <NavLink to="/products" className="secondary-btn">Shop Products</NavLink>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glow-card large-card">
            <FaMagic className="sparkle" />
            <div>
              <strong>Glow Ritual</strong>
              <span>Hydration + Brightening</span>
            </div>
          </div>
          <div className="glow-card small-card">
            <span>4.9/5</span>
            <small>Customer love</small>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Shop by Category</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-item" key={category}>
              <div className="category-badge">{category}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Featured Products</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block why-section">
        <div className="section-heading">
          <h2>Why GlowCart?</h2>
        </div>
        <div className="why-grid">
          {['Personalized', 'Quality Products', 'Secure Checkout', 'Fast Delivery'].map((item) => (
            <div className="why-card" key={item}>
              <FaCheckCircle />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <h2>Not sure what your skin needs?</h2>
          <p>Take the skin quiz and get a routine built around your skin goals.</p>
        </div>
        <NavLink to="/quiz" className="primary-btn">Take the Skin Quiz</NavLink>
      </section>
    </div>
  );
}

function ProductsPage() {
  return (
    <div className="page-shell">
      <h1>Shop Glow Essentials</h1>
      <div className="shop-layout">
        <aside className="filter-panel">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Category</label>
            <select>
              <option>All</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Price</label>
            <input type="range" min="0" max="20000" defaultValue="15000" />
          </div>
          <div className="filter-group">
            <label>Skin Type</label>
            <select>
              <option>All</option>
              <option>Dry</option>
              <option>Oily</option>
              <option>Combination</option>
              <option>Sensitive</option>
            </select>
          </div>
        </aside>

        <div className="products-panel">
          <div className="toolbar">
            <span>Showing 12 products</span>
            <select>
              <option>Featured</option>
              <option>Newest</option>
              <option>Price Low - High</option>
              <option>Price High - Low</option>
            </select>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({ preferredProducts: [] });
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const question = quizQuestions[questionIndex];
  const isMultiSelect = question?.id === 'preferredProducts';
  const currentAnswer = answers[question?.id] ?? (isMultiSelect ? [] : '');

  const selectOption = (value) => {
    setError('');
    setAnswers((previous) => {
      if (isMultiSelect) {
        const selected = previous[question.id] ?? [];
        return {
          ...previous,
          [question.id]: selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value],
        };
      }

      return { ...previous, [question.id]: value };
    });
  };

  const handleNext = () => {
    const hasAnswer = isMultiSelect ? currentAnswer.length > 0 : Boolean(currentAnswer);
    if (!hasAnswer) {
      setError(isMultiSelect ? 'Choose at least one product type to continue.' : 'Choose an answer to continue.');
      return;
    }

    setError('');
    if (questionIndex === quizQuestions.length - 1) {
      setRecommendations(getRecommendations(answers));
      return;
    }
    setQuestionIndex((index) => index + 1);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setAnswers({ preferredProducts: [] });
    setError('');
    setRecommendations(null);
  };

  if (recommendations) {
    return (
      <div className="page-shell quiz-shell">
        <section className="quiz-card quiz-results" aria-live="polite">
          <span className="eyebrow">Your Glow Profile</span>
          <h2>Your routine, matched to you.</h2>
          <div className="quiz-summary">
            <span>{answers.skinType} skin</span>
            <span>{answers.primaryConcern}</span>
            <span>{answers.budget}</span>
          </div>
          <h3>Recommended for your routine</h3>
          <div className="product-grid">
            {recommendations.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
          <button className="secondary-btn quiz-restart" type="button" onClick={restartQuiz}>Retake quiz</button>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell quiz-shell">
      <div className="quiz-card">
        <div className="quiz-header">
          <span>Question {questionIndex + 1} of {quizQuestions.length}</span>
          <div className="progress-bar" role="progressbar" aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={quizQuestions.length}>
            <span style={{ width: `${((questionIndex + 1) / quizQuestions.length) * 100}%` }} />
          </div>
        </div>
        <h2>{question.question}</h2>
        <div className="quiz-options">
          {question.options.map((option) => {
            const value = option.label || option;
            const selected = isMultiSelect ? currentAnswer.includes(value) : currentAnswer === value;
            return (
            <button
              key={value}
              className={`quiz-option${selected ? ' selected' : ''}`}
              type="button"
              aria-pressed={selected}
              onClick={() => selectOption(value)}
            >
              <strong>{option.label || option}</strong>
              {typeof option === 'object' && <small>{option.description}</small>}
            </button>
            );
          })}
        </div>
        {error && <p className="quiz-error" role="alert">{error}</p>}
        <div className="quiz-actions">
          <button
            className="secondary-btn"
            type="button"
            disabled={questionIndex === 0}
            onClick={() => { setQuestionIndex((index) => index - 1); setError(''); }}
          >
            Back
          </button>
          <button className="primary-btn" type="button" onClick={handleNext}>
            {questionIndex === quizQuestions.length - 1 ? 'See my routine' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="page-shell auth-shell">
      <div className="auth-card">
        <h1>Login</h1>
        <form className="auth-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" className="primary-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="page-shell auth-shell">
      <div className="auth-card">
        <h1>Create account</h1>
        <form className="auth-form">
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" className="primary-btn">Create account</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="logo-box">G</div>
          <div>
            <strong>GlowCart</strong>
            <small>Your Skin. Your Glow. Your Cart.</small>
          </div>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          className={`main-nav${isMenuOpen ? ' is-open' : ''}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setIsMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/quiz" onClick={() => setIsMenuOpen(false)}>Skin Quiz</NavLink>
          <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
          <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>Register</NavLink>
        </nav>

        <div className="nav-icons">
          <span><FaHeart /></span>
          <span><FaShoppingCart /></span>
          <span><FaUser /></span>
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>GlowCart — “Find what makes you glow.”</p>
      </footer>
    </div>
  );
}

export default App;
