"""Virality scores (0-10 per factor) for the education reels, keyed by reel file name. Same formula as virality2:
score = 10 x (.20 hook + .20 button + .25 send + .15 originality + .20 reach) - 4.   hook, button, send, originality, reach"""
S = {
 # science & maths
 "215_birthday_paradox": (9, 9, 9, 7, 8), "216_chessboard_rice": (8, 9, 8, 6, 8), "217_earths_in_sun": (9, 9, 8, 7, 8), "218_speed_of_light": (8, 8, 8, 5, 8),
 "219_thunder_math": (8, 7, 8, 6, 8), "220_deck_of_cards": (9, 9, 8, 7, 8), "221_rule_of_72": (8, 8, 8, 6, 8), "222_gps_einstein": (9, 9, 8, 8, 8),
 "223_pi_digits": (8, 8, 7, 6, 7), "224_banana_radiation": (9, 8, 8, 7, 8),
 # space & earth
 "225_earth_in_24_hours": (9, 10, 9, 7, 9), "226_earth_black_hole": (9, 9, 8, 8, 8), "227_venus_day": (9, 8, 8, 6, 8), "228_olympus_mons": (8, 8, 7, 6, 7),
 "229_iss_sixteen_sunrises": (9, 9, 8, 7, 8), "230_moon_leaving": (9, 9, 8, 7, 8), "231_sun_power_hour": (9, 9, 8, 7, 8), "232_sun_death_timeline": (9, 9, 8, 6, 8),
 "233_saturn_floats": (9, 8, 8, 7, 8), "234_tallest_mountain_three_answers": (9, 9, 8, 8, 8),
 # body
 "235_heartbeats_lifetime": (8, 9, 9, 6, 9), "236_brain_20_watts": (8, 8, 8, 6, 8), "237_baby_bones": (9, 8, 8, 7, 8), "238_body_rebuilt": (8, 9, 8, 7, 8),
 "239_breaths_a_day": (8, 8, 8, 5, 8), "240_ruler_reaction_test": (9, 9, 9, 7, 8), "241_ten_thousand_steps": (9, 9, 9, 6, 9), "242_body_water": (8, 8, 8, 5, 8),
 "243_dna_shared": (9, 9, 9, 6, 8), "244_sleep_vs_drunk": (10, 9, 10, 7, 10),
 # animals
 "245_fastest_animal_peregrine": (9, 9, 8, 6, 9), "246_blue_whale_numbers": (8, 8, 8, 5, 8), "247_octopus_alien": (9, 8, 8, 6, 8), "248_hummingbird_heart": (9, 8, 8, 6, 8),
 "249_elephant_facts": (8, 8, 8, 5, 8), "250_tardigrade_space": (9, 9, 8, 7, 8), "251_ants_per_person": (9, 9, 8, 7, 8), "252_sharks_older_than_trees": (9, 9, 8, 8, 8),
 "253_honeybee_teaspoon": (9, 9, 8, 7, 8), "254_giraffe_neck": (8, 8, 8, 5, 8),
 # history & geography
 "255_cleopatra_pyramid_moon": (10, 10, 9, 7, 9), "256_oxford_older_than_aztecs": (9, 9, 8, 7, 8), "257_mammoths_pyramids": (9, 9, 8, 7, 8), "258_nintendo_1889": (9, 9, 8, 7, 8),
 "259_pluto_vs_russia": (8, 8, 8, 7, 7), "260_world_fits_in_texas": (9, 9, 8, 7, 8), "261_canada_lakes_coast": (8, 8, 8, 5, 8), "262_mariana_trench_everest": (9, 9, 8, 6, 9),
 "263_antarctica_desert": (9, 8, 8, 6, 8), "264_sahara_was_green": (9, 9, 8, 8, 8), "265_most_time_zones": (8, 8, 8, 6, 8), "266_smallest_country_vatican": (8, 8, 8, 5, 8),
 # money
 "267_five_dollars_a_day": (8, 9, 9, 5, 9), "268_million_dollars_hours": (9, 9, 9, 6, 9), "269_spend_1000_per_second": (9, 9, 8, 7, 8), "270_lottery_vs_lightning": (9, 8, 9, 6, 9),
 "271_all_gold_one_cube": (8, 8, 7, 7, 7), "272_inflation_one_dollar": (9, 9, 9, 6, 10), "273_start_at_25_vs_35": (9, 10, 10, 6, 9), "274_subscriptions_add_up": (9, 9, 10, 6, 10),
 "275_credit_card_trap": (9, 9, 9, 6, 9), "276_weight_of_a_million": (9, 8, 8, 8, 8),
 # everyday science
 "277_why_sky_is_blue": (8, 8, 8, 5, 8), "278_lightning_hotter_than_sun": (9, 8, 8, 6, 8), "279_cloud_weight": (9, 9, 8, 7, 8), "280_iceberg_90_percent": (8, 8, 8, 5, 8),
 "281_leap_year_math": (8, 8, 8, 6, 8), "282_water_drop_molecules": (9, 9, 8, 7, 7), "283_doorknob_shock_volts": (9, 8, 9, 6, 9), "284_great_wall_from_space_myth": (9, 9, 9, 6, 9),
 "285_glass_is_not_liquid": (9, 9, 8, 6, 8), "286_rainbow_circle_42": (8, 9, 8, 6, 8),
 # tech
 "287_apollo_computer_vs_iphone": (9, 9, 8, 6, 8), "288_transistors_4004_to_m1": (8, 8, 7, 6, 7), "289_first_text_message_160": (9, 9, 8, 7, 8), "290_first_youtube_video": (8, 9, 8, 6, 8),
 "291_first_website_1991": (8, 8, 7, 6, 7), "292_first_computer_bug_moth": (9, 9, 8, 7, 8), "293_undersea_internet_cables": (9, 8, 8, 6, 8), "294_download_speed_history": (8, 8, 8, 6, 8),
 "295_password_crack_time": (9, 9, 9, 6, 9), "296_terabyte_shows_931": (9, 9, 9, 6, 9),
 # food & health
 "297_cola_sugar_teaspoons": (10, 9, 9, 5, 10), "298_pizza_size_math": (9, 9, 9, 7, 9), "299_honey_never_spoils": (8, 8, 8, 5, 8), "300_coffee_world_numbers": (8, 8, 8, 5, 8),
 "301_beef_water_footprint": (9, 8, 8, 6, 8), "302_scoville_scale": (9, 8, 8, 6, 8), "303_caffeine_half_life": (9, 9, 9, 6, 9), "304_big_mac_walk": (9, 9, 9, 6, 9),
 "305_sleep_cycles_90": (9, 8, 9, 5, 9), "306_ocean_salt_layer": (9, 8, 7, 7, 7),
 # maths
 "307_monty_hall_switch": (9, 9, 8, 5, 8), "308_zero_point_nine_repeating": (9, 9, 8, 5, 8), "309_rubiks_cube_quintillion": (8, 8, 7, 6, 7), "310_gauss_sum_1_to_100": (8, 9, 7, 5, 7),
 "311_group_chat_pairs": (9, 8, 10, 8, 9), "312_googol_vs_atoms": (8, 8, 7, 5, 7), "313_two_dice_seven": (8, 8, 8, 5, 8), "314_coin_flip_streaks": (9, 9, 8, 8, 8),
 "315_benfords_law": (9, 9, 8, 8, 7), "316_who_invented_zero": (8, 9, 9, 7, 8),
 # what if
 "317_drive_to_space_moon_sun": (10, 9, 9, 7, 9), "318_walk_around_the_earth": (8, 8, 8, 5, 8), "319_earth_stops_spinning": (9, 8, 8, 5, 8), "320_mars_signal_delay": (8, 8, 8, 6, 7),
 "321_felix_baumgartner_supersonic": (10, 9, 8, 6, 9), "322_penny_empire_state_myth": (9, 9, 8, 6, 8), "323_read_all_wikipedia": (8, 8, 8, 6, 8), "324_humans_ever_lived": (9, 10, 9, 7, 9),
 "325_new_horizons_pluto": (8, 8, 7, 6, 7), "326_population_billions_faster": (8, 9, 8, 6, 8),
 # rankings
 "327_tallest_buildings_ranked": (8, 8, 8, 5, 8), "328_biggest_countries_ranked": (8, 8, 8, 5, 8), "329_most_populated_countries_ranked": (8, 8, 9, 5, 9), "330_longest_rivers_ranked": (8, 8, 8, 5, 8),
 "331_highest_mountains_ranked": (8, 8, 8, 5, 8), "332_most_spoken_languages_ranked": (9, 8, 9, 6, 9), "333_oldest_living_things_ranked": (9, 9, 8, 7, 8), "334_speed_ladder": (9, 9, 8, 7, 8),
 "335_deadliest_animals_ranked": (10, 9, 9, 6, 9), "336_moons_bigger_than_mercury": (9, 9, 8, 7, 8),
}
def score(name):
    h, b, s, o, r = S[name]; return round(10 * (.20 * h + .20 * b + .25 * s + .15 * o + .20 * r) - 4, 1)
