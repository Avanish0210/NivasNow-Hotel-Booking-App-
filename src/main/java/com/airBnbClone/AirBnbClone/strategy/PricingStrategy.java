package com.airBnbClone.AirBnbClone.strategy;

import com.airBnbClone.AirBnbClone.entity.Inventory;


import java.math.BigDecimal;

public interface PricingStrategy {

    BigDecimal calculatePrice(Inventory inventory);
}
