import { goToStep } from "./stepNavigation.js";

$(function () {
  // -------------------- HELPERS --------------------
  function updateContinueButtons() {
    $(".selected-recipes").each(function () {
      const $container = $(this);
      const selectedCount = $container.find(".recipe-card.filled").length;

      // Find all continue buttons linked to this container
      // Here we assume the button is inside the same step wrapper
      const $buttons = $(".continue-btn");
      console.log($buttons);
      $buttons.toggleClass("inactive", selectedCount !== 3);
    });
  }

  function refreshSlotPlaceholders() {
    $(".selected-recipes").each(function () {
      const $container = $(this);
      $container.find(".recipe-card").each(function (i) {
        const $slot = $(this);
        if (!$slot.hasClass("filled")) {
          $slot
            .find("div")
            .css("background-image", "")
            .text(i + 1);
          $slot.find("h4").html("&nbsp;");
        }
      });
    });
  }

  // -------------------- ADD / REMOVE --------------------
  function addRecipeToSlots($recipe) {
    $(".selected-recipes").each(function () {
      const $container = $(this);
      const $slot = $container.find(".recipe-card").not(".filled").first();
      if (!$slot.length) return;

      $slot.addClass("filled").data("recipeId", $recipe.data("recipeId"));
      $slot.find("div").css("background-image", $recipe.data("bg")).text("");
      $slot.find("h4").text($recipe.data("title"));

      // Add remove button if not present
      if ($slot.find(".remove-btn").length === 0) {
        const $remove = $(`
          <button class="remove-btn absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8L15 15M8 8L1 1M8 8L1 15M8 8L15 1" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        `);
        $remove.on("click", () => removeRecipeFromSlots($recipe));
        $slot.append($remove);
      }

      // ------------------ CONFETTI (desktop only) ------------------
      if ($(window).width() > 768) {
        const rect = $slot.find("div")[0].getBoundingClientRect();
        confetti({
          particleCount: 30,
          startVelocity: 25,
          spread: 60,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
        });
      }
    });

    $recipe.addClass("used").css({ "pointer-events": "none", opacity: 0.5 });
    updateContinueButtons();
  }

  function removeRecipeFromSlots($recipe) {
    $(".selected-recipes .recipe-card").each(function () {
      const $slot = $(this);
      if ($slot.data("recipeId") === $recipe.data("recipeId")) {
        $slot.removeClass("filled").data("recipeId", "");
        $slot.find(".remove-btn").remove();
      }
    });

    // Restore recipe tile
    $recipe.removeClass("used").css({ "pointer-events": "", opacity: 1 });
    $recipe.find("div").css("background-image", $recipe.data("bg"));
    $recipe.find("h4").html($recipe.data("title"));
    $recipe.css("box-shadow", $recipe.data("shadow"));

    refreshSlotPlaceholders();
    updateContinueButtons();
  }

  // -------------------- DRAG & DROP (desktop only) --------------------
  if ($(window).width() > 768) {
    $("#recipes .recipe-card").draggable({
      helper: "clone",
      cursor: "grabbing",
      revert: "invalid",
      start: function (event, ui) {
        const $tile = $(this);
        $tile.addClass("dragging");
        $tile.data({
          originalBg: $tile.find("div").css("background-image"),
          originalTitle: $tile.find("h4").text(),
          originalShadow: $tile.css("box-shadow"),
        });
        $tile.css("opacity", 0);
        $tile.find("h4").html("&nbsp;");
        ui.helper.css({ "z-index": 12, width: $tile.outerWidth(), height: $tile.outerHeight() });
      },
      stop: function () {
        const $tile = $(this);
        $tile.removeClass("dragging");
        if (!$tile.hasClass("used")) {
          $tile.css("opacity", 1);
          $tile.find("div").css("background-image", $tile.data("bg"));
          $tile.find("h4").html($tile.data("title"));
          $tile.css("box-shadow", $tile.data("shadow"));
        }
      },
    });

    $(".selected-recipes:first .recipe-card").droppable({
      accept: "#recipes .recipe-card:not(.used)",
      hoverClass: "is-hovered",
      drop: function (event, ui) {
        addRecipeToSlots(ui.draggable);
      },
    });
  }

  // -------------------- CLICK TO ADD (desktop + mobile) --------------------
  $("#recipes .recipe-card").on("click", function () {
    const $recipe = $(this);
    if ($recipe.hasClass("used")) return;
    addRecipeToSlots($recipe);
  });

  // -------------------- CONTINUE BUTTON --------------------
  $(".continue-btn").on("click", function () {
    const $button = $(this);
    if ($button.hasClass("inactive")) return;

    const $finalContainer = $("#final-selected-recipes");
    $finalContainer.empty();

    // Use the visible container
    $(".selected-recipes:visible .recipe-card.filled").each(function (index) {
      const recipeId = $(this).data("recipeId");
      const $recipe = $(`#recipes .recipe-card[data-recipe-id='${recipeId}']`);
      const title = $recipe.data("title");
      const bg = $recipe.data("bg");

      // Fill form input
      $(`#selected-recipe-${index + 1}`).val(title);

      // Add final card
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

    goToStep(2, 3);
  });

  // -------------------- INITIALIZATION --------------------
  $(".selected-recipes .recipe-card").each(function (i) {
    $(this)
      .data("index", i + 1)
      .css("position", "relative");
  });

  $("#recipes .recipe-card").each(function (i) {
    const $div = $(this).find("div");
    const $h4 = $(this).find("h4");
    $(this).data({ bg: $div.css("background-image"), shadow: $(this).css("box-shadow"), title: $h4.text(), index: i + 1 });
  });

  refreshSlotPlaceholders();
  updateContinueButtons();
});
