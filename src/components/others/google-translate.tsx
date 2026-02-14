"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Languages, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/ui/mode-switcher"

declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: any
  }
}

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "हिन्दी (Hindi)", code: "hi" },
  { label: "தமிழ் (Tamil)", code: "ta" },
]

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,ta",
          autoDisplay: false,
        },
        "google_translate_element"
      )
    }
  }, [])

  const handleLanguageChange = (langCode: string) => {
    const googleCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement
    if (googleCombo) {
      googleCombo.value = langCode
      googleCombo.dispatchEvent(new Event("change"))
      setCurrentLang(langCode)
    }
  }

  return (
    <>
      <div id="google_translate_element" className="hidden" />

      <div className="fixed bottom-4 left-4 z-50 flex cursor-pointer items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="bg-background border-primary/20 hover:border-primary/50 gap-2 rounded-full border-2 shadow-xl transition-all"
            >
              <Languages className="text-primary h-5 w-5" />
              <span className="font-medium">
                {LANGUAGES.find((l) => l.code === currentLang)?.label || "Language"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="flex cursor-pointer items-center justify-between rounded-lg py-2"
              >
                {lang.label}
                {currentLang === lang.code && <Check className="text-primary h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  )
}
