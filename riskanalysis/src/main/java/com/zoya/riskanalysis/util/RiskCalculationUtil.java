package com.zoya.riskanalysis.util;

import com.zoya.riskanalysis.enums.RiskLevel;

public class RiskCalculationUtil {

    public static int calculateScore(int probability, int impact) {
        return probability * impact;
    }

    public static RiskLevel calculateLevel(int score) {
        if (score <= 5) {
            return RiskLevel.LOW;
        } else if (score <= 10) {
            return RiskLevel.MEDIUM;
        } else if (score <= 15) {
            return RiskLevel.HIGH;
        } else {
            return RiskLevel.CRITICAL;
        }
    }
}