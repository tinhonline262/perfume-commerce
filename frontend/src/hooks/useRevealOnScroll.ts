import { useEffect } from "react";

export const useRevealOnScroll = (dependencyKey?: string | number): void => {
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));

        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8%", threshold: 0.16 }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [dependencyKey]);
};
