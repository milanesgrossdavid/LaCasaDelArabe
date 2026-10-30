"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";
const questions = [
  {
    title: "¿Para quién buscas una fragancia?",
    sub: "Empecemos por la persona.",
    options: ["Mujer", "Hombre", "Unisex"],
  },
  {
    title: "¿Qué ambiente te atrae?",
    sub: "Elige la sensación que te gustaría llevar.",
    options: [
      "Fresco y limpio",
      "Dulce y cálido",
      "Floral y elegante",
      "Amaderado e intenso",
    ],
  },
  {
    title: "¿Cuándo la usarás más?",
    sub: "Piensa en el momento que quieres acompañar.",
    options: ["Día", "Noche", "Trabajo", "Una ocasión especial"],
  },
];
export default function Guia() {
  const { perfumes } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const done = step >= questions.length;
  const familyFor = (v: string) =>
    ({
      "Fresco y limpio": ["Fresca", "Cítrica"],
      "Dulce y cálido": ["Gourmand", "Ambarada"],
      "Floral y elegante": ["Floral"],
      "Amaderado e intenso": ["Amaderada", "Ambarada"],
    })[v] || [];
  const results = done
    ? perfumes.filter(
        (p) =>
          (answers[0] === "Unisex" ||
            p.gender === answers[0] ||
            p.gender === "Unisex") &&
          familyFor(answers[1]).includes(p.family),
      )
    : [];
  return (
    <div className="page-shell guide-page">
      <div className="guide-intro">
        <h1>
          Encuentra tu <em>esencia.</em>
        </h1>
        <p>
          Responde tres preguntas sencillas y descubre fragancias que podrían
          encajar contigo.
        </p>
      </div>
      {!done ? (
        <div className="quiz-card">
          <div className="quiz-progress">
            <span>PREGUNTA 0{step + 1} / 03</span>
            <div>
              <i style={{ width: `${((step + 1) / 3) * 100}%` }} />
            </div>
          </div>
          <h2>{questions[step].title}</h2>
          <p>{questions[step].sub}</p>
          <div className="quiz-options">
            {questions[step].options.map((o) => (
              <button
                key={o}
                className={
                  answers[step] === o ? "quiz-option selected" : "quiz-option"
                }
                onClick={() => {
                  const a = [...answers];
                  a[step] = o;
                  setAnswers(a);
                }}
              >
                {o}
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          <div className="quiz-footer">
            <button
              className="text-link"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft size={15} /> Anterior
            </button>
            <button
              className="button button-dark"
              disabled={!answers[step]}
              onClick={() => setStep((s) => s + 1)}
            >
              {step === 2 ? "Ver resultados" : "Continuar"}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <h2>
            Un punto de partida <em>para descubrir.</em>
          </h2>
          <p>
            Esta guía es orientativa: las preferencias olfativas son personales.
            Prueba las fragancias que te llamen la atención.
          </p>
          {results.length ? (
            <div className="product-grid">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>
                No hay una coincidencia exacta en nuestra selección de ejemplo.
                Explora todo el catálogo para descubrir otras familias.
              </p>
              <Link href="/catalogo" className="button button-dark">
                Explorar catálogo
              </Link>
            </div>
          )}
          <button
            className="text-link retake"
            onClick={() => {
              setStep(0);
              setAnswers([]);
            }}
          >
            Volver a empezar <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
