import { goToStep } from "./stepNavigation.js";

$(function () {
  $("#continue").on("click", function () {
    if ($(this).hasClass("inactive")) return;

    const $finalContainer = $("#final-selected-recipes");
    $finalContainer.empty(); // clear anything existing

    const $selectedSlots = $("#selected-recipes .recipe-card.filled");

    $selectedSlots.each(function (index) {
      const recipeId = $(this).data("recipeId");
      const $recipe = $("#recipes .recipe-card[data-recipe-id='" + recipeId + "']");

      const title = $recipe.data("title");
      const bg = $recipe.data("bg");

      // ---------------- FORM INPUT ----------------
      $(`#selected-recipe-${index + 1}`).val(title);

      // ---------------- FINAL CARD ----------------
      const $card = $(`
      <div class="rounded-[14px] relative bg-[#f5f0ec] w-full">
        <div class="shadow-sm rounded-[14px] bg-white overflow-hidden z-10 relative" draggable="false">
          <div class="h-45 bg-cover bg-center"></div>
          <h4 class="uppercase p-4"></h4>
        </div>
      </div>
    `);

      $card.find(".h-45").css("background-image", bg);
      $card.find("h4").text(title);

      $finalContainer.append($card);
    });

    // Move to next step
    goToStep(2, 3);
  });

  // -------------------- HELPERS --------------------
  function updateContinueButton() {
    const selectedCount = $("#selected-recipes .recipe-card.filled").length;

    $("#continue").toggleClass("inactive", selectedCount < 3);
  }

  function addRecipeToSlot($recipe) {
    const $slot = $("#selected-recipes .recipe-card").not(".filled").first();
    if (!$slot.length) return; // no empty slots

    $slot.addClass("filled").data("recipeId", $recipe.data("recipeId"));

    // Set slot content
    $slot.find("div").css("background-image", $recipe.data("bg")).text("");
    $slot.find("h4").text($recipe.data("title"));

    // Mark recipe as used
    $recipe.addClass("used").css({
      "pointer-events": "none",
      opacity: 0.5,
    });

    // ------------------ CONFETTI ------------------
    // Get slot position relative to viewport
    const rect = $slot.find("div")[0].getBoundingClientRect();

    // Fire confetti from the center of the slot
    confetti({
      particleCount: 30,
      startVelocity: 25,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
    });

    // Add remove button
    const $remove = $(`
      <button class="remove-btn absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8L15 15M8 8L1 1M8 8L1 15M8 8L15 1" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `);

    $remove.on("click", function () {
      $slot.removeClass("filled").data("recipeId", "");
      $slot.find("div").css("background-image", "").text($slot.data("index"));
      $slot.find("h4").html("&nbsp;");

      // Restore original recipe
      $recipe.removeClass("used").css({
        "pointer-events": "",
        opacity: 1,
      });
      $recipe.find("div").css("background-image", $recipe.data("bg"));
      $recipe.find("h4").html($recipe.data("title"));
      $recipe.css("box-shadow", $recipe.data("shadow"));

      $remove.remove();
      updateContinueButton();
    });

    $slot.append($remove);

    updateContinueButton();
  }

  // -------------------- DRAGGABLE --------------------
  $("#recipes .recipe-card").draggable({
    helper: "clone",
    cursor: "grabbing",
    revert: "invalid",
    start: function (event, ui) {
      const $tile = $(this);
      $tile.addClass("dragging");

      // Save original state
      $tile.data({
        originalBg: $tile.find("div").css("background-image"),
        originalTitle: $tile.find("h4").text(),
        originalShadow: $tile.css("box-shadow"),
      });

      // Make the original transparent while dragging
      $tile.css("opacity", 0); // <-- fades the original
      $tile.find("h4").html("&nbsp;"); // optional, keep number blank

      // Set clone style
      ui.helper.css({
        "z-index": 12,
        width: $tile.outerWidth(),
        height: $tile.outerHeight(),
      });
    },
    stop: function () {
      const $tile = $(this);
      $tile.removeClass("dragging");

      // Restore opacity if not used
      if (!$tile.hasClass("used")) {
        $tile.css("opacity", 1);
        $tile.find("div").css("background-image", $tile.data("bg"));
        $tile.find("h4").html($tile.data("title"));
        $tile.css("box-shadow", $tile.data("shadow"));
      }
    },
  });

  // -------------------- DROPPABLE --------------------
  $("#selected-recipes .recipe-card").droppable({
    accept: "#recipes .recipe-card:not(.used)",
    hoverClass: "is-hovered",
    drop: function (event, ui) {
      const $dragged = $(ui.helper).clone();
      const original = $("#recipes .recipe-card[data-recipe-id='" + $dragged.data("recipeId") + "']");
      addRecipeToSlot(original);

      // Restore original tile immediately
      original.find("div").css("background-image", original.data("bg"));
      original.find("h4").html(original.data("title"));
      original.css("box-shadow", original.data("shadow"));
    },
  });

  // -------------------- CLICK TO ADD --------------------
  $("#recipes .recipe-card").on("click", function () {
    const $recipe = $(this);
    if ($recipe.hasClass("used")) return;
    addRecipeToSlot($recipe);
  });

  // -------------------- INITIALIZATION --------------------
  // Slot numbering
  $("#selected-recipes .recipe-card").each(function (i) {
    $(this)
      .data("index", i + 1)
      .css("position", "relative");
  });

  // Store original recipe data
  $("#recipes .recipe-card").each(function (i) {
    const $div = $(this).find("div");
    const $h4 = $(this).find("h4");
    $(this).data({
      bg: $div.css("background-image"), // store original background
      shadow: $(this).css("box-shadow"),
      title: $h4.text(),
      index: i + 1,
    });
  });

  updateContinueButton();
});
