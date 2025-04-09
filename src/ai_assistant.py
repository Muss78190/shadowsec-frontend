def generate_recommendations(report_text):
    lines = report_text.splitlines()
    suggestions = []

    for line in lines:
        if "SQLi détectée" in line:
            suggestions.append("➡️ Utilisez des requêtes préparées pour éviter les injections SQL.")
        if "XSS détectée" in line:
            suggestions.append("➡️ Échappez toujours les caractères HTML dans les entrées utilisateur.")
        if "Ports ouverts détectés" in line:
            suggestions.append("➡️ Fermez les ports inutiles et utilisez un pare-feu.")
        if "Serveur Web détecté" in line:
            suggestions.append("➡️ Mettez à jour votre serveur web et désactivez les modules non nécessaires.")

    if not suggestions:
        suggestions.append("✅ Aucun problème critique détecté. Continuez votre vigilance !")
    
    return suggestions
