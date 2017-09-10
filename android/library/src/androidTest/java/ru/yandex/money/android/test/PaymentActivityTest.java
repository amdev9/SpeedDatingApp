/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 NBCO Yandex.Money LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package ru.yandex.money.android.test;

import android.content.Intent;
import android.support.annotation.NonNull;
import android.test.ActivityInstrumentationTestCase2;
import android.test.suitebuilder.annotation.LargeTest;
import android.view.View;

import com.robotium.solo.Condition;
import com.robotium.solo.Solo;
import com.yandex.money.api.methods.payment.params.PaymentParams;

import java.util.concurrent.TimeUnit;

import ru.yandex.money.android.PaymentActivity;
import ru.yandex.money.android.test.espresso.ViewGroupInteraction;
import ru.yandex.money.android.test.properties.LocalProperties;
import ru.yandex.money.android.test.properties.TestProperties;

import static android.support.test.espresso.Espresso.onView;
import static android.support.test.espresso.Espresso.pressBack;
import static android.support.test.espresso.action.ViewActions.click;
import static android.support.test.espresso.action.ViewActions.typeText;
import static android.support.test.espresso.assertion.ViewAssertions.matches;
import static android.support.test.espresso.matcher.ViewMatchers.isDisplayed;
import static android.support.test.espresso.matcher.ViewMatchers.isRoot;
import static android.support.test.espresso.matcher.ViewMatchers.withId;
import static android.support.test.espresso.matcher.ViewMatchers.withText;
import static com.robotium.solo.By.id;
import static org.hamcrest.Matchers.not;
import static ru.yandex.money.android.test.espresso.MoreViewActions.waitView;
import static ru.yandex.money.android.test.espresso.MoreViewActions.waitVisibilityChange;
import static ru.yandex.money.android.test.espresso.ViewGroupInteraction.onViewGroup;

/**
 * @author Slava Yasevich (vyasevich@yamoney.ru)
 */
@LargeTest
public final class PaymentActivityTest extends ActivityInstrumentationTestCase2<PaymentActivity> {

    private static final String CARD_NUMBER_ID = "cardNumber";

    private final LocalProperties localProperties = new LocalProperties();
    private final TestProperties testProperties = new TestProperties();

    private Solo solo;

    public PaymentActivityTest() {
        super(PaymentActivity.class);
    }

    @Override
    protected void setUp() throws Exception {
        super.setUp();
        AppData.clean(getInstrumentation().getTargetContext());
    }

    public void testInvalidId() {
        new Test("invalid") {
            @Override
            protected void execute() {
                waitForFragment();
                onView(withId(R.id.ym_error_title))
                        .check(matches(withText(R.string.ym_error_illegal_param_client_id_title)));
                onView(withId(R.id.ym_error_message))
                        .check(matches(withText(R.string.ym_error_illegal_param_client_id)));
                onView(withId(R.id.ym_error_action))
                        .check(matches(not(isDisplayed())));
            }
        }.run();
    }

    public void testHome() {
        new ClientTest() {
            @Override
            protected void execute() {
                waitForFragment();
                onView(withId(android.R.id.home))
                        .perform(click());
            }
        }.run();
    }

    public void testNewCard() {
        new ClientTest() {
            @Override
            protected void execute() {
                waitForFragment();
                // check that there was no error
                onView(withId(R.id.web_view)).check(matches(isDisplayed()));
                onView(withId(R.id.ym_error_title))
                        .check(matches(not(isDisplayed())));

                payNewCard();
            }
        }.run();
    }

    public void testSavedCard() {
        new WithSavedCardTest() {
            @Override
            protected void execute() {
                paySavedCard();
            }
        }.run();
    }

    public void testSavedCardDeletion() {
        new WithSavedCardTest() {
            @Override
            protected void execute() {
                waitForCards();
                deleteSavedCard();
                clickOnListItem(0);
                waitForWebView();
            }
        }.run();
    }

    public void testSavedCardCanceledNewCard() {
        new WithSavedCardNewCardTest() {
            @Override
            protected void cancel() {
                onView(withId(R.id.ym_cancel))
                        .perform(click());
            }
        }.run();
    }

    public void testSavedCardCanceledBackNewCard() {
        new WithSavedCardNewCardTest() {
            @Override
            protected void cancel() {
                pressBack();
            }
        }.run();
    }

    public void testNewCardCanceledSavedCard() {
        new WithSavedCardTest() {
            @Override
            protected void execute() {
                waitForCards();
                clickOnListItem(1);

                waitForWebView();
                pressBack();

                paySavedCard();
            }
        }.run();
    }

    public void testSavedCardDeletedNewCardCanceled() {
        new WithSavedCardTest() {
            @Override
            protected void execute() {
                waitForCards();
                deleteSavedCard();
                clickOnListItem(0);
                waitForWebView();
                pressBack();
                waitForCards();
            }
        }.run();
    }

    private void waitForFragment() {
        solo.waitForFragmentById(R.id.ym_container);
    }

    private void payNewCard() {
        waitForWebView();

        // entering card details
        LocalProperties.Card card = localProperties.getCard();
        solo.enterTextInWebElement(id(CARD_NUMBER_ID), card.number);
        solo.enterTextInWebElement(id("month"), card.month);
        solo.enterTextInWebElement(id("year"), card.year);
        solo.enterTextInWebElement(id("cardCvc"), card.csc);
        solo.clickOnWebElement(id("mobile-cps_submit-button"));

        // waiting for success payment, may require manual user input (3D Secure for instance)
        onView(isRoot()).perform(waitView(testProperties.getManualTimeout(),
                withId(R.id.ym_success)));

        // checking success page and trying to save a card
        onView(withId(R.id.ym_comment))
                .check(matches(withText(getString(R.string.ym_success_comment,
                        localProperties.getAmount()))));
        onView(withId(R.id.ym_description))
                .check(matches(withText(R.string.ym_success_save_card_description)));
        onView(withId(R.id.ym_save_card))
                .check(matches(withText(R.string.ym_success_save_card)))
                .perform(click());

        // waiting for a card to be saved
        onView(withId(R.id.ym_save_card))
                .perform(waitVisibilityChange(testProperties.getNetworkTimeout(), View.GONE));

        // when a card is saved
        onView(withId(R.id.ym_success_marker))
                .check(matches(isDisplayed()));
    }

    private void paySavedCard() {
        waitForCards();
        clickOnListItem(0);
        initSavedCardPayment();

        onView(isRoot())
                .perform(waitView(testProperties.getNetworkTimeout(), withId(R.id.ym_success)));

        onView(withId(R.id.ym_card))
                .check(matches(not(isDisplayed())));
        onView(withId(R.id.ym_description))
                .check(matches(not(isDisplayed())));
        onView(withId(R.id.ym_success_marker))
                .check(matches(not(isDisplayed())));
        onView(withId(R.id.ym_save_card))
                .check(matches(not(isDisplayed())));
    }

    private void deleteSavedCard() {
        getItemAtPosition(0)
                .onChildView(withId(R.id.ym_card_container))
                .onChildView(withId(R.id.ym_actions))
                .perform(click());

        onView(isRoot())
                .perform(waitView(testProperties.getAnimationsTimeout(),
                        withText(R.string.ym_cards_delete_card)))
                .perform(click());
    }

    private void waitForWebView() {
        solo.waitForCondition(new Condition() {
            @Override
            public boolean isSatisfied() {
                return !solo.getWebElements(id(CARD_NUMBER_ID)).isEmpty();
            }
        }, sleep(testProperties.getNetworkTimeout()));
    }

    private void waitForCards() {
        onView(isRoot())
                .perform(waitView(testProperties.getNetworkTimeout(), withId(android.R.id.list)));
        onView(withId(R.id.ym_payment_sum))
                .check(matches(withText(getString(R.string.ym_cards_payment_sum_value,
                        localProperties.getAmount()))));
    }

    private void clickOnListItem(int position) {
        getItemAtPosition(position)
                .perform(click());
    }

    private ViewGroupInteraction getItemAtPosition(int position) {
        return onViewGroup(withId(android.R.id.list)).atPosition(position);
    }

    private void initSavedCardPayment() {
        onView(withId(R.id.ym_csc))
                .perform(typeText(localProperties.getCard().csc));
        onView(withId(R.id.ym_pay))
                .perform(click());
    }

    private int sleep(int seconds) {
        return (int) TimeUnit.SECONDS.toMillis(seconds);
    }

    private String getString(int resId, Object... params) {
        return getActivity().getString(resId, params);
    }

    private abstract class Test implements Runnable {

        private final String clientId;

        public Test(String clientId) {
            this.clientId = clientId;
        }

        @Override
        public void run() {
            prepare();
            setUp();
            execute();
        }

        protected void prepare() {
        }

        protected abstract void execute();

        private void setUp() {
            Intent intent = PaymentActivity.getBuilder(getInstrumentation().getContext())
                    .setPaymentParams(createArguments())
                    .setClientId(clientId)
                    .setHost(localProperties.getHostUrl())
                    .build();
            setActivityIntent(intent);

            solo = new Solo(getInstrumentation(), getActivity());
        }

        @NonNull
        private PaymentParams createArguments() {
            return localProperties.getPhoneParams();
        }
    }

    private abstract class ClientTest extends Test {
        public ClientTest() {
            super(localProperties.getClientId());
        }
    }

    private abstract class WithSavedCardTest extends ClientTest {
        @Override
        protected final void prepare() {
            AppData.addSavedCard(getInstrumentation().getContext(), localProperties.getInstanceId(),
                    localProperties.getCard());
        }
    }

    private abstract class WithSavedCardNewCardTest extends WithSavedCardTest {
        @Override
        protected final void execute() {
            waitForCards();
            clickOnListItem(0);

            onView(withId(R.id.ym_pay))
                    .perform(click());

            onView(withId(R.id.ym_error))
                    .check(matches(isDisplayed()));
            onView(withId(R.id.ym_error_title))
                    .check(matches(withText(R.string.ym_error_oops_title)));
            onView(withId(R.id.ym_error_message))
                    .check(matches(withText(R.string.ym_error_csc_invalid)));

            cancel();
            waitForCards();
            clickOnListItem(1);
            payNewCard();
        }

        protected abstract void cancel();
    }
}
